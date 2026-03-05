/**
 * InfiniteCanvas — Zoomable/pannable conversation space.
 *
 * The main conversation thread runs vertically using the same chat-bubble
 * style as the rest of the app (user right-aligned, agent left-aligned).
 * When subagents are delegated, their threads branch to the right as
 * parallel columns. Zoom out to see all threads working simultaneously,
 * or zoom in to focus on the main thread (which feels like a normal chat).
 *
 * Visual concept:
 *
 *   ┌─── Main Thread (chat) ───┐   ┌─ Subagent A ──┐   ┌─ Subagent B ──┐
 *   │          [system pill]    │   │               │   │               │
 *   │                    [user] │   │               │   │               │
 *   │ [agent]                   │───│ ○ search_kb   │   │               │
 *   │ 🔀 3 threads spawned →   │ ╲ │ ○ analyze     │   │               │
 *   │                           │  ╲│ ● Done        │   │               │
 *   │                           │   ╲───────────────│───│ ○ shell       │
 *   │ [agent — synthesis]       │◄──┴───────────────┴───│ ✕ Error       │
 *   │                    [user] │                       │               │
 *   └──────────────────────────┘                        └───────────────┘
 */

import { useState, useRef, useCallback, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Home,
  GitBranch,
  GitMerge,
  Check,
  X,
  Bot,
  User,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { ChatInput } from './ChatInput';

// ─── Types ─────────────────────────────────────────────────

interface ToolStep {
  name: string;
  description: string;
  status: 'completed' | 'running' | 'error';
  duration?: string;
}

interface ThreadMessage {
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp?: string;
}

interface SubagentThread {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'error' | 'pending';
  tools: ToolStep[];
  messages: ThreadMessage[]; // Chat messages within this subthread
  result?: string;
  error?: string;
  duration?: string;
}

interface DelegationPoint {
  /** Index in the main thread where delegation happens */
  afterMessageIndex: number;
  threads: SubagentThread[];
  mergeStatus: 'pending' | 'running' | 'completed';
  mergeResult?: string;
}

export interface InfiniteCanvasProps {
  messages: ThreadMessage[];
  delegations: DelegationPoint[];
  className?: string;
  /** Currently selected thread ID, or null for main thread */
  selectedThread?: string | null;
  /** Callback when thread selection changes */
  onThreadSelect?: (threadId: string | null) => void;
  /** Callback when user sends a message */
  onSend?: (message: string, threadId: string | null) => void;
  /** Whether the agent is currently streaming a response */
  isStreaming?: boolean;
  /** Callback to stop streaming */
  onStop?: () => void;
  /** Hide overlay controls (ChatInput, zoom controls, target indicator) - useful for mini previews */
  hideControls?: boolean;
}

// ─── Constants ─────────────────────────────────────────────

const MAIN_THREAD_WIDTH = 360;
const THREAD_WIDTH = 360; // Same width as main thread for consistent chat feel
const THREAD_GAP = 32;
const MAIN_THREAD_X = 24;
const BRANCH_START_X = MAIN_THREAD_X + MAIN_THREAD_WIDTH + THREAD_GAP + 40;

// ─── Zoom Controls ─────────────────────────────────────────

function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitAll,
  onResetView,
}: {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitAll: () => void;
  onResetView: () => void;
}) {
  return (
    <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-1 py-1 shadow-lg">
      <button
        onClick={onResetView}
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Reset to main thread"
      >
        <Home className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onFitAll}
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Fit all threads"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-4 bg-border mx-0.5" />
      <button
        onClick={onZoomOut}
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Zoom out"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>
      <span className="text-[10px] text-muted-foreground font-mono w-10 text-center">
        {Math.round(zoom * 100)}%
      </span>
      <button
        onClick={onZoomIn}
        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        title="Zoom in"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Tool Call Pill (inline, matches MiniConversation style) ─

function ToolPill({ tool }: { tool: ToolStep }) {
  const isRunning = tool.status === 'running';
  const isError = tool.status === 'error';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border',
        isRunning
          ? 'bg-[hsl(var(--status-warning)/0.08)] text-foreground border-[hsl(var(--status-warning)/0.2)]'
          : isError
            ? 'bg-[hsl(var(--status-error)/0.08)] text-foreground border-[hsl(var(--status-error)/0.2)]'
            : 'bg-muted text-muted-foreground border-border',
      )}
    >
      <span className="font-medium">{tool.name}</span>
      <span className="text-muted-foreground">—</span>
      <span className="truncate max-w-[100px]">{tool.description}</span>
      {isRunning ? (
        <RefreshCw className="w-2.5 h-2.5 animate-spin text-[hsl(var(--status-warning))] flex-shrink-0" />
      ) : isError ? (
        <X className="w-2.5 h-2.5 text-[hsl(var(--status-error))] flex-shrink-0" />
      ) : (
        <Check className="w-2.5 h-2.5 text-[hsl(var(--status-success))] flex-shrink-0" />
      )}
      {tool.duration && (
        <span className="text-[8px] text-muted-foreground/60 font-mono ml-0.5">{tool.duration}</span>
      )}
    </div>
  );
}

// ─── Status Dot ────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: 'border-[hsl(var(--status-success))]',
    running: 'border-[hsl(var(--status-warning))]',
    error: 'border-[hsl(var(--status-error))]',
    pending: 'border-muted-foreground/30',
  };
  return (
    <div className={cn('w-[6px] h-[6px] rounded-full border-[1.5px] bg-background flex-shrink-0', colors[status] || colors.pending)} />
  );
}

// ─── Subagent Thread Column (Chat Style) ───────────────────

function SubagentColumn({
  thread,
  style,
  isSelected,
  isOtherSelected,
  onSelect,
}: {
  thread: SubagentThread;
  style?: React.CSSProperties;
  isSelected: boolean;
  isOtherSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={cn(
        'absolute rounded-lg p-3 transition-all duration-200 cursor-pointer',
        isSelected
          ? 'bg-primary/5 ring-2 ring-primary/50 ring-offset-1 ring-offset-background'
          : isOtherSelected
            ? 'opacity-40 hover:opacity-60'
            : 'hover:bg-muted/20',
      )}
      style={{ width: THREAD_WIDTH + 24, marginLeft: -12, marginTop: -12, ...style }}
      data-thread-id={thread.id}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      <div style={{ width: THREAD_WIDTH }}>
        {/* Thread header */}
        <div className={cn(
          'flex items-center gap-1.5 mb-3 pb-2 border-b',
          isSelected ? 'border-primary/30' : 'border-border',
        )}>
          <StatusDot status={thread.status} />
          <GitBranch className={cn('w-3.5 h-3.5', isSelected ? 'text-primary' : 'text-muted-foreground')} />
          <span className={cn('text-[12px] font-medium truncate', isSelected && 'text-primary')}>
            {thread.name}
          </span>
          {isSelected && (
            <span className="text-[9px] text-primary bg-primary/20 px-1.5 py-0.5 rounded ml-auto">
              targeting
            </span>
          )}
          {!isSelected && thread.status === 'running' && (
            <RefreshCw className="w-3 h-3 animate-spin text-[hsl(var(--status-warning))] ml-auto" />
          )}
          {!isSelected && thread.duration && thread.status !== 'running' && (
            <span className="text-[10px] text-muted-foreground font-mono ml-auto">{thread.duration}</span>
          )}
        </div>

        {/* Chat messages - same style as main thread */}
        <div className="space-y-3">
          {thread.messages.map((msg, i) => {
            if (msg.role === 'system') {
              return (
                <div key={i} className="flex justify-center">
                  <div className="text-[10px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    {msg.content}
                  </div>
                </div>
              );
            }

            if (msg.role === 'user') {
              return (
                <div key={i} className="flex gap-2 justify-end">
                  <div className="message-user max-w-[75%]">
                    <p className="text-[12px] leading-relaxed">{msg.content}</p>
                    {msg.timestamp && (
                      <p className="text-[9px] text-muted-foreground/50 text-right mt-1">{msg.timestamp}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-0.5">
                    <User className="w-2.5 h-2.5 text-primary-foreground" />
                  </div>
                </div>
              );
            }

            // Agent message
            return (
              <div key={i} className="flex gap-2 justify-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5">
                  <Bot className="w-2.5 h-2.5 text-muted-foreground" />
                </div>
                <div className="message-agent max-w-[80%]">
                  <p className="text-[12px] leading-relaxed">{msg.content}</p>
                  {msg.timestamp && (
                    <p className="text-[9px] text-muted-foreground/50 mt-1">{msg.timestamp}</p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Tool calls shown as compact pills after messages */}
          {thread.tools.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2 border-t border-border/50">
              {thread.tools.map((tool, i) => (
                <ToolPill key={i} tool={tool} />
              ))}
            </div>
          )}

          {/* Result */}
          {thread.result && (
            <div className="mt-2 px-3 py-2 text-[11px] text-foreground/80 bg-[hsl(var(--status-success)/0.08)] border-l-2 border-[hsl(var(--status-success))] rounded-r">
              {thread.result}
            </div>
          )}

          {/* Error */}
          {thread.error && (
            <div className="mt-2 px-3 py-2 text-[11px] text-[hsl(var(--status-error))] bg-[hsl(var(--status-error)/0.08)] border-l-2 border-[hsl(var(--status-error))] rounded-r">
              {thread.error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Connection Lines (SVG) ────────────────────────────────

function ConnectionLines({
  delegations,
  delegationYPositions,
  selectedThread,
}: {
  delegations: DelegationPoint[];
  delegationYPositions: Map<number, number>;
  selectedThread: string | null;
}) {
  return (
    <svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
      {delegations.map((delegation, di) => {
        const startY = delegationYPositions.get(di) || 0;
        const mainThreadRight = MAIN_THREAD_X + MAIN_THREAD_WIDTH + 8;

        return delegation.threads.map((thread, ti) => {
          const threadX = BRANCH_START_X + ti * (THREAD_WIDTH + THREAD_GAP);
          const threadY = startY;
          const isSelected = selectedThread === thread.id;
          const hasSelection = selectedThread !== null;

          return (
            <g
              key={`${di}-${ti}`}
              className="transition-opacity duration-200"
              style={{ opacity: hasSelection && !isSelected ? 0.3 : 1 }}
            >
              {/* Branch line from main thread to subagent */}
              <path
                d={`M ${mainThreadRight} ${threadY} C ${mainThreadRight + 30} ${threadY}, ${threadX - 30} ${threadY}, ${threadX} ${threadY}`}
                fill="none"
                stroke={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                strokeWidth={isSelected ? 2 : 1}
                strokeDasharray={thread.status === 'pending' ? '3,3' : 'none'}
                className="transition-all duration-200"
              />
              {/* Branch dot at start */}
              <circle
                cx={mainThreadRight}
                cy={threadY}
                r={isSelected ? 4 : 3}
                fill={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--background))'}
                stroke={isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
                strokeWidth="1.5"
                className="transition-all duration-200"
              />
            </g>
          );
        });
      })}
    </svg>
  );
}

// ─── Main Component ────────────────────────────────────────

export function InfiniteCanvas({
  messages,
  delegations,
  className,
  selectedThread: controlledSelectedThread,
  onThreadSelect,
  onSend,
  isStreaming = false,
  onStop,
  hideControls = false,
}: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  // Track mouse position for click vs drag detection on main thread
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);

  // Selection state - controlled or uncontrolled
  const [internalSelectedThread, setInternalSelectedThread] = useState<string | null>(null);
  const selectedThread = controlledSelectedThread !== undefined ? controlledSelectedThread : internalSelectedThread;

  // Get the name of the selected thread for the indicator
  const selectedThreadName = useMemo(() => {
    if (selectedThread === null) return null;
    for (const delegation of delegations) {
      const thread = delegation.threads.find(t => t.id === selectedThread);
      if (thread) return thread.name;
    }
    return null;
  }, [selectedThread, delegations]);

  // Pre-calculate delegation Y positions based on message structure
  // This allows us to use them in both rendering and centering logic
  const delegationYPositions = useMemo(() => {
    const positions = new Map<number, number>();
    let runningY = 20;
    
    messages.forEach((msg, i) => {
      // Estimate heights for each message type
      if (msg.role === 'system') {
        runningY += 40;
      } else {
        runningY += 60;
      }
      
      // Check if there's a delegation after this message
      const delegationIndex = delegations.findIndex(d => d.afterMessageIndex === i);
      if (delegationIndex !== -1) {
        positions.set(delegationIndex, runningY + 16);
        runningY += 70; // delegation indicator height
        
        // Add merge indicator height if applicable
        const delegation = delegations[delegationIndex];
        if (delegation.mergeStatus !== 'pending') {
          runningY += 60;
        }
      }
    });
    
    return positions;
  }, [messages, delegations]);

  // Total canvas dimensions
  const maxThreads = delegations.reduce((max, d) => Math.max(max, d.threads.length), 0);
  const canvasWidth = BRANCH_START_X + maxThreads * (THREAD_WIDTH + THREAD_GAP) + 60;
  const canvasHeight = messages.length * 80 + delegations.length * 80 + 300;
  
  // Position the selected thread in the upper portion of the viewport
  // This leaves room for the chat input at the bottom
  const centerOnThread = useCallback((threadId: string | null) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const viewportCenterX = rect.width / 2;
    // Position thread at ~25% from top instead of center (50%)
    const viewportTargetY = rect.height * 0.25;
    
    if (threadId === null) {
      // Center on main thread horizontally, position near top
      const mainThreadCenterX = MAIN_THREAD_X + MAIN_THREAD_WIDTH / 2;
      const mainThreadTopY = 40; // Account for header
      const targetPanX = viewportCenterX - mainThreadCenterX * zoom;
      const targetPanY = viewportTargetY - mainThreadTopY * zoom;
      setPan({ x: targetPanX, y: targetPanY });
    } else {
      // Find the thread position
      for (let di = 0; di < delegations.length; di++) {
        const delegation = delegations[di];
        const threadIndex = delegation.threads.findIndex(t => t.id === threadId);
        if (threadIndex !== -1) {
          const threadX = BRANCH_START_X + threadIndex * (THREAD_WIDTH + THREAD_GAP) + THREAD_WIDTH / 2;
          const threadY = (delegationYPositions.get(di) || 0) + 20; // Top of thread
          
          const targetPanX = viewportCenterX - threadX * zoom;
          const targetPanY = viewportTargetY - threadY * zoom;
          
          setPan({ x: targetPanX, y: targetPanY });
          break;
        }
      }
    }
  }, [zoom, delegations, delegationYPositions]);

  const handleThreadSelect = useCallback((threadId: string | null) => {
    if (onThreadSelect) {
      onThreadSelect(threadId);
    } else {
      setInternalSelectedThread(threadId);
    }
    
    // Center the view on the selected thread
    if (threadId !== null) {
      // Small delay to allow state to update, then center
      setTimeout(() => centerOnThread(threadId), 50);
    }
  }, [onThreadSelect, centerOnThread]);

  // Pan handlers with click detection for deselecting
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      mouseDownPos.current = { x: e.clientX, y: e.clientY };
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    setIsPanning(false);
    
    // Check if this was a click (not a drag) on the main canvas area
    if (mouseDownPos.current) {
      const dx = Math.abs(e.clientX - mouseDownPos.current.x);
      const dy = Math.abs(e.clientY - mouseDownPos.current.y);
      
      // If moved less than 5px, treat as click - deselect to main thread
      if (dx < 5 && dy < 5 && selectedThread !== null) {
        handleThreadSelect(null);
      }
    }
    mouseDownPos.current = null;
  }, [selectedThread, handleThreadSelect]);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom(z => Math.max(0.2, Math.min(2, z + delta)));
    }
  }, []);

  // Zoom controls
  const zoomIn = () => setZoom(z => Math.min(2, z + 0.15));
  const zoomOut = () => setZoom(z => Math.max(0.2, z - 0.15));
  const fitAll = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = rect.width / canvasWidth;
    const scaleY = rect.height / canvasHeight;
    const newZoom = Math.min(scaleX, scaleY, 1) * 0.9;
    setZoom(newZoom);
    setPan({ x: 20, y: 20 });
  };
  const resetView = () => {
    setZoom(0.85);
    setPan({ x: 0, y: 0 });
  };

  // ─── Build the main thread elements ────────────────────
  // We interleave messages with delegation indicators and merge indicators.
  const threadElements: React.ReactNode[] = [];
  let runningY = 20; // track approximate Y for connection lines

  messages.forEach((msg, i) => {
    // ── System message ──
    if (msg.role === 'system') {
      threadElements.push(
        <div key={`msg-${i}`} className="flex justify-center">
          <div className="text-[10px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {msg.content}
          </div>
        </div>,
      );
      runningY += 40;
    }

    // ── User message ──
    else if (msg.role === 'user') {
      threadElements.push(
        <div key={`msg-${i}`} className="flex gap-2 justify-end">
          <div className="message-user max-w-[75%]">
            <p className="text-[12px] leading-relaxed">{msg.content}</p>
            {msg.timestamp && (
              <p className="text-[9px] text-muted-foreground/50 text-right mt-1">{msg.timestamp}</p>
            )}
          </div>
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-0.5">
            <User className="w-2.5 h-2.5 text-primary-foreground" />
          </div>
        </div>,
      );
      runningY += 60;
    }

    // ── Agent message ──
    else {
      threadElements.push(
        <div key={`msg-${i}`} className="flex gap-2 justify-start">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5">
            <Bot className="w-2.5 h-2.5 text-muted-foreground" />
          </div>
          <div className="message-agent max-w-[80%]">
            <p className="text-[12px] leading-relaxed">{msg.content}</p>
            {msg.timestamp && (
              <p className="text-[9px] text-muted-foreground/50 mt-1">{msg.timestamp}</p>
            )}
          </div>
        </div>,
      );
      runningY += 60;
    }

    // ── Delegation indicator (after this message) ──
    const delegation = delegations.find(d => d.afterMessageIndex === i);
    if (delegation) {
      threadElements.push(
        <div key={`delegate-${i}`} className="flex gap-2 justify-start">
          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5">
            <Bot className="w-2.5 h-2.5 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-1.5">
            {/* Tool calls from all threads (shown as pills) */}
            {delegation.threads.some(t => t.tools.length > 0) && (
              <div className="flex flex-wrap gap-1">
                {delegation.threads.flatMap(t =>
                  t.tools.map((tool, ti) => (
                    <ToolPill key={`${t.id}-${ti}`} tool={tool} />
                  )),
                )}
              </div>
            )}

            {/* Branch indicator */}
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <GitBranch className="w-3 h-3" />
              <span className="font-medium">
                {delegation.threads.length} threads spawned →
              </span>
              <span className="font-mono text-[9px]">
                {delegation.threads.filter(t => t.status === 'completed').length}/{delegation.threads.length} done
              </span>
            </div>
          </div>
        </div>,
      );
      runningY += 70;

      // ── Merge indicator ──
      if (delegation.mergeStatus !== 'pending') {
        threadElements.push(
          <div key={`merge-${i}`} className="flex gap-2 justify-start">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center mt-0.5">
              <Bot className="w-2.5 h-2.5 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <GitMerge className="w-3 h-3" />
                <span className="font-medium">
                  {delegation.mergeStatus === 'completed' ? 'Threads merged' : 'Synthesizing...'}
                </span>
                {delegation.mergeStatus === 'running' && (
                  <RefreshCw className="w-2.5 h-2.5 animate-spin text-[hsl(var(--status-warning))]" />
                )}
                {delegation.mergeStatus === 'completed' && (
                  <Check className="w-3 h-3 text-[hsl(var(--status-success))]" />
                )}
              </div>
              {delegation.mergeResult && (
                <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
                  {delegation.mergeResult}
                </p>
              )}
            </div>
          </div>,
        );
        runningY += 60;
      }
    }
  });

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden bg-background border border-border rounded-lg select-none',
        isPanning ? 'cursor-grabbing' : 'cursor-grab',
        className,
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPanning(false)}
      onWheel={handleWheel}
    >
      {/* Canvas surface */}
      <div
        className="absolute origin-top-left transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
        {/* Connection lines */}
        <ConnectionLines
          delegations={delegations}
          delegationYPositions={delegationYPositions}
          selectedThread={selectedThread}
        />

        {/* ── Main conversation thread ── */}
        <div
          className={cn(
            'absolute py-4 transition-all duration-200 rounded-lg cursor-pointer',
            selectedThread === null
              ? 'ring-2 ring-primary/50 ring-offset-2 ring-offset-background bg-primary/5'
              : 'opacity-60 hover:opacity-80',
          )}
          style={{ left: MAIN_THREAD_X - 12, top: 0, width: MAIN_THREAD_WIDTH + 24, paddingLeft: 12, paddingRight: 12 }}
          onClick={(e) => {
            e.stopPropagation();
            if (selectedThread !== null) {
              handleThreadSelect(null);
            }
          }}
        >
          {/* Main thread header */}
          <div className={cn(
            'flex items-center gap-1.5 mb-3 pb-2 border-b',
            selectedThread === null ? 'border-primary/30' : 'border-border',
          )}>
            <Home className={cn('w-3.5 h-3.5', selectedThread === null ? 'text-primary' : 'text-muted-foreground')} />
            <span className={cn('text-[12px] font-medium', selectedThread === null && 'text-primary')}>
              Main Thread
            </span>
            {selectedThread === null && (
              <span className="text-[9px] text-primary bg-primary/20 px-1.5 py-0.5 rounded ml-auto">
                targeting
              </span>
            )}
          </div>
          <div className="space-y-3">
            {threadElements}
          </div>
        </div>

        {/* ── Subagent thread columns ── */}
        {delegations.map((delegation, di) => {
          const startY = delegationYPositions.get(di) || 0;
          return delegation.threads.map((thread, ti) => (
            <SubagentColumn
              key={`${di}-${ti}`}
              thread={thread}
              isSelected={selectedThread === thread.id}
              isOtherSelected={selectedThread !== null && selectedThread !== thread.id}
              onSelect={() => handleThreadSelect(selectedThread === thread.id ? null : thread.id)}
              style={{
                left: BRANCH_START_X + ti * (THREAD_WIDTH + THREAD_GAP),
                top: startY + 20,
              }}
            />
          ));
        })}
      </div>

      {/* Fixed chat input at bottom - centered (hidden in mini preview) */}
      {!hideControls && (
        <div 
          className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-background via-background to-transparent pt-6 flex justify-center"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div style={{ width: MAIN_THREAD_WIDTH }}>
            <ChatInput
              placeholder={selectedThread === null 
                ? "Message goose..." 
                : `Message ${selectedThreadName || 'subthread'}...`
              }
              onSend={(msg) => onSend?.(msg, selectedThread)}
              onStop={onStop}
              isStreaming={isStreaming}
            />
          </div>
        </div>
      )}

      {/* Target indicator overlay - moved above chat input (hidden in mini preview) */}
      {!hideControls && (
        <div className="absolute bottom-[90px] left-3 z-20">
          <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5 shadow-lg">
            <span className="text-[10px] text-muted-foreground">Targeting:</span>
            {selectedThread === null ? (
              <span className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
                <Home className="w-3 h-3" />
                Main Thread
              </span>
            ) : (
              <span className="text-[11px] font-medium text-primary flex items-center gap-1.5">
                <GitBranch className="w-3 h-3" />
                {selectedThreadName || selectedThread}
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </span>
            )}
          </div>
        </div>
      )}

      {/* Zoom controls overlay (hidden in mini preview) */}
      {!hideControls && (
        <ZoomControls
          zoom={zoom}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onFitAll={fitAll}
          onResetView={resetView}
        />
      )}

      {/* Minimap hint (hidden in mini preview) */}
      {!hideControls && zoom < 0.8 && (
        <div className="absolute top-3 left-3 z-20 text-[9px] text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded border border-border">
          ⌘+scroll to zoom · drag to pan
        </div>
      )}
    </div>
  );
}
