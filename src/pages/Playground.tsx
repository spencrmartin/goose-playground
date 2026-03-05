import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Type,
  Palette,
  MousePointer2,
  MessageSquare,
  Brain,
  Terminal,
  LayoutGrid,
  PanelLeft,
  Command,
  FileText,
  CreditCard,
  Monitor,
  RefreshCw,
  ExternalLink,
  PanelRightClose,
  ClipboardList,
  Search,
  Wrench,
  Check,
  Bot,
  User,
  Paperclip,
  GitBranch,
  X,
  Home,
  Globe,
  Settings,
  FolderOpen,
  Mic,
  Maximize2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GooseLogo } from '../components/icons/GooseLogo';
import { AgentBurst } from '../components/icons/AgentBurst';

// UI Components
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

// Chat Components
import { ToolCallPill } from '../components/chat/ToolCallPill';
import { ThinkingBlock } from '../components/chat/ThinkingBlock';
import { MessageBubble } from '../components/chat/MessageBubble';
import { ArtifactCard } from '../components/chat/ArtifactCard';
import { AppCard } from '../components/chat/AppCard';
import { ChatInput } from '../components/chat/ChatInput';
import { SubagentFlow } from '../components/chat/SubagentFlow';
import { InfiniteCanvas } from '../components/chat/InfiniteCanvas';
import { InlinePill } from '../components/chat/InlinePill';
import { SquareIcon, CashAppIcon, NexusIcon } from '../components/icons/BlockAppIcons';
import { DeveloperIcon } from '../components/icons/AppIcons';
import { AppDock } from '../components/layout/AppDock';

// Layout Components
import { SessionTabs, type SessionStatus } from '../components/layout/SessionTabs';
import { Sidebar } from '../components/layout/Sidebar';
import { CommandScreen } from '../components/layout/CommandScreen';
import PixelBlast from '../components/ui/PixelBlast';

// ─── Section wrapper ───────────────────────────────────────
function Section({
  id,
  title,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-12">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-[15px] font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ─── Nav items for sidebar ─────────────────────────────────
const navItems = [
  { id: 'app-preview', label: 'Full App Preview', icon: Monitor },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'buttons', label: 'Buttons & Inputs', icon: MousePointer2 },
  { id: 'tool-pills', label: 'Tool Call Pills', icon: Terminal },
  { id: 'subagent-flow', label: 'Subagent Flow', icon: GitBranch },
  { id: 'infinite-canvas', label: 'Infinite Canvas', icon: Maximize2 },
  { id: 'thinking', label: 'Thinking Block', icon: Brain },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'inline-pills', label: 'Inline Pills', icon: Globe },
  { id: 'artifacts', label: 'Artifact Cards', icon: FileText },
  { id: 'app-cards', label: 'App Cards', icon: CreditCard },
  { id: 'chat-input', label: 'Chat Input', icon: LayoutGrid },
  { id: 'session-tabs', label: 'Session Tabs', icon: LayoutGrid },
  { id: 'sidebar', label: 'Sidebar', icon: PanelLeft },
  { id: 'command', label: 'Command Screen', icon: Command },
];

// ─── Static Mini App Preview ───────────────────────────────
// Self-contained mock of the full app layout — no store/router deps.
// Renders at a constrained size to showcase how everything composes.

/** Map session status → PixelBlast color + speed (mirrors SessionTabs.tsx).
 *  idle adapts to theme: white in dark mode, black in light mode. */
function getMiniStatusConfig(isDark: boolean): Record<SessionStatus, { color: string; speed: number }> {
  return {
    idle:     { color: isDark ? '#FFFFFF' : '#000000', speed: 0.15 },
    working:  { color: '#3B82F6', speed: 0.35 },
    complete: { color: '#22C55E', speed: 0.10 },
    error:    { color: '#EF4444', speed: 0.15 },
    waiting:  { color: '#EAB308', speed: 0.15 },
  };
}

function MiniSessionTabs({ status = 'idle' as SessionStatus, isDark = true }: { status?: SessionStatus; isDark?: boolean }) {
  const { color, speed } = getMiniStatusConfig(isDark)[status];
  return (
    <div className="relative flex items-center gap-0.5 px-2 h-8 border-b border-border overflow-hidden">
      {/* PixelBlast background — color & speed driven by session status */}
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none">
        <PixelBlast
          variant="square"
          pixelSize={2}
          color={color}
          speed={speed}
          patternScale={3}
          patternDensity={0.6}
          edgeFade={0.3}
          enableRipples={false}
          transparent
        />
      </div>
      {/* Home button */}
      <div className="relative z-10 w-5 h-5 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted/50 flex-shrink-0">
        <Home className="w-2.5 h-2.5" />
      </div>
      {/* Tabs */}
      <div className="relative z-10 flex items-center gap-0.5 flex-1 min-w-0">
        <div className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-muted/80 backdrop-blur-sm text-foreground">
          <span className="relative flex-shrink-0">
            <MessageSquare className="w-2.5 h-2.5" />
            <span className="absolute -bottom-0.5 -right-0.5"><DeveloperIcon size={6} /></span>
          </span>
          <span>Tauri Migration</span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] text-muted-foreground">
          <span className="relative flex-shrink-0">
            <MessageSquare className="w-2.5 h-2.5" />
            <span className="absolute -bottom-0.5 -right-0.5"><DeveloperIcon size={6} /></span>
          </span>
          <span>Design System</span>
          <span className="w-1 h-1 rounded-full bg-[hsl(var(--user-accent))]" />
        </div>
      </div>
      {/* Floating app dock */}
      <div className="relative z-10 flex-shrink-0">
        <AppDock
          baseSize={20}
          hoverSize={32}
          items={[
            { id: 'square', name: 'Square', icon: <SquareIcon size={20} /> },
            { id: 'cash', name: 'Cash App', icon: <CashAppIcon size={20} /> },
            { id: 'nexus', name: 'Nexus', icon: <NexusIcon size={20} /> },
          ]}
        />
      </div>
    </div>
  );
}

function MiniConversation({ paddingLeft = 12, paddingRight = 12 }: { paddingLeft?: number; paddingRight?: number }) {
  return (
    <div className="flex-1 overflow-y-auto py-2" style={{ paddingLeft, paddingRight }}>
    <div className="max-w-[420px] mx-auto space-y-2">
      {/* System message */}
      <div className="flex justify-center">
        <div className="text-[7px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
          Session started — Goose 2.0 project
        </div>
      </div>

      {/* User message */}
      <div className="flex gap-1 justify-end">
        <div className="message-user max-w-[75%]">
          <p className="text-[9px] leading-tight">Set up the Tauri project structure and configure the sidecar for goosed</p>
        </div>
        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center mt-0.5">
          <User className="w-2 h-2 text-primary-foreground" />
        </div>
      </div>

      {/* Agent message with thinking + tool calls */}
      <div className="flex gap-1 justify-start">
        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-muted flex items-center justify-center mt-0.5">
          <Bot className="w-2 h-2 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1 max-w-[80%]">
          {/* Thinking indicator */}
          <div className="flex items-center gap-1 text-[7px] text-muted-foreground">
            <span className="flex items-center justify-center w-3 h-3 rounded-full bg-muted flex-shrink-0">
              <Brain className="w-1.5 h-1.5" />
            </span>
            <span className="font-medium">Thought process</span>
          </div>
          <div className="message-agent">
            <p className="text-[9px] leading-tight">I'll set up the Tauri v2 project. Let me analyze the existing structure first.</p>
          </div>
          {/* Tool calls */}
          <div className="flex flex-wrap gap-0.5">
            <div className="inline-flex items-center gap-0.5 px-1 py-px rounded text-[7px] bg-muted text-muted-foreground border border-border">
              <Search className="w-1.5 h-1.5" />
              <span className="font-medium">analyze</span>
              <span className="text-muted-foreground">—</span>
              <span className="truncate max-w-[80px]">Project structure</span>
              <Check className="w-1.5 h-1.5 text-[hsl(var(--status-success))]" />
            </div>
            <div className="inline-flex items-center gap-0.5 px-1 py-px rounded text-[7px] bg-muted text-muted-foreground border border-border">
              <FileText className="w-1.5 h-1.5" />
              <span className="font-medium">text_editor</span>
              <span className="text-muted-foreground">—</span>
              <span className="truncate max-w-[80px]">tauri.conf.json</span>
              <Check className="w-1.5 h-1.5 text-[hsl(var(--status-success))]" />
            </div>
            <div className="inline-flex items-center gap-0.5 px-1 py-px rounded text-[7px] bg-muted text-muted-foreground border border-border">
              <Terminal className="w-1.5 h-1.5" />
              <span className="font-medium">shell</span>
              <span className="text-muted-foreground">—</span>
              <span className="truncate max-w-[80px]">cargo init</span>
              <Check className="w-1.5 h-1.5 text-[hsl(var(--status-success))]" />
            </div>
          </div>
        </div>
      </div>

      {/* Agent follow-up with artifact */}
      <div className="flex gap-1 justify-start">
        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-muted flex items-center justify-center mt-0.5">
          <Bot className="w-2 h-2 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1 max-w-[80%]">
          <div className="message-agent">
            <p className="text-[9px] leading-tight">Done! Here's the project structure I created:</p>
          </div>
          {/* Mini artifact */}
          <div className="rounded border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-1 px-1.5 py-0.5 border-b border-border bg-muted/50">
              <FileText className="w-2 h-2 text-muted-foreground" />
              <span className="text-[8px] font-medium">Project Structure</span>
            </div>
            <pre className="px-1.5 py-1 text-[7px] font-mono text-muted-foreground leading-relaxed">{`ui/tauri/
├── src-tauri/
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── src/main.rs
└── frontend/
    ├── package.json
    └── src/App.tsx`}</pre>
          </div>
        </div>
      </div>

      {/* User follow-up */}
      <div className="flex gap-1 justify-end">
        <div className="message-user max-w-[75%]">
          <p className="text-[9px] leading-tight">Now check Point A for the current sprint status</p>
        </div>
        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center mt-0.5">
          <User className="w-2 h-2 text-primary-foreground" />
        </div>
      </div>

      {/* Agent with Point A tool call */}
      <div className="flex gap-1 justify-start">
        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-muted flex items-center justify-center mt-0.5">
          <Bot className="w-2 h-2 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1 max-w-[80%]">
          <div className="message-agent">
            <p className="text-[9px] leading-tight">Let me pull the sprint data from Point A.</p>
          </div>
          <div className="flex flex-wrap gap-0.5">
            <div className="inline-flex items-center gap-0.5 px-1 py-px rounded text-[7px] bg-muted text-muted-foreground border border-border">
              <ClipboardList className="w-1.5 h-1.5" />
              <span className="font-medium">search_issues</span>
              <span className="text-muted-foreground">—</span>
              <span className="truncate max-w-[80px]">Sprint 3</span>
              <Check className="w-1.5 h-1.5 text-[hsl(var(--status-success))]" />
            </div>
          </div>
          <div className="message-agent">
            <p className="text-[9px] leading-tight">Sprint 3 has 5 issues: 2 in progress, 2 todo, 1 backlog. The Tauri Shell & Design System tasks are active.</p>
          </div>
        </div>
      </div>

      {/* User asks to search knowledge */}
      <div className="flex gap-1 justify-end">
        <div className="message-user max-w-[75%]">
          <p className="text-[9px] leading-tight">Search Brian for any notes on the sidecar architecture</p>
        </div>
        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center mt-0.5">
          <User className="w-2 h-2 text-primary-foreground" />
        </div>
      </div>

      {/* Agent with Brian search + inline pill references */}
      <div className="flex gap-1 justify-start">
        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-muted flex items-center justify-center mt-0.5">
          <Bot className="w-2 h-2 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1 max-w-[80%]">
          <div className="flex flex-wrap gap-0.5">
            <div className="inline-flex items-center gap-0.5 px-1 py-px rounded text-[7px] bg-muted text-muted-foreground border border-border">
              <Brain className="w-1.5 h-1.5" />
              <span className="font-medium">search_knowledge</span>
              <span className="text-muted-foreground">—</span>
              <span className="truncate max-w-[80px]">sidecar arch</span>
              <Check className="w-1.5 h-1.5 text-[hsl(var(--status-success))]" />
            </div>
          </div>
          <div className="message-agent">
            <p className="text-[9px] leading-relaxed">
              Found it. The{' '}
              <InlinePill
                size="sm"
                type="knowledge"
                label="Sidecar Pattern"
                subtitle="Brian Knowledge Base"
                previewContent="The goosed binary runs as a Tauri sidecar process, communicating over localhost. The sidecar is bundled with the app and managed by Tauri's lifecycle."
                meta={[
                  { label: 'Source', value: 'Brian' },
                  { label: 'Updated', value: '3 days ago' },
                ]}
              />{' '}
              note describes how goosed runs alongside the app. I updated{' '}
              <InlinePill
                size="sm"
                type="file"
                label="tauri.conf.json"
                subtitle="src-tauri/tauri.conf.json"
                previewContent={`"sidecar": {\n  "command": "goosed",\n  "args": ["--port", "3000"]\n}`}
                meta={[
                  { label: 'Lines', value: '42' },
                  { label: 'Modified', value: 'Just now' },
                ]}
              />{' '}
              with the sidecar config. The{' '}
              <InlinePill
                size="sm"
                type="link"
                label="Tauri Docs"
                href="https://v2.tauri.app/develop/sidecar"
                subtitle="Tauri v2 — Sidecar guide"
                previewContent="Sidecars are executables bundled with your app. Tauri manages their lifecycle, and they communicate via IPC or localhost."
                meta={[
                  { label: 'Version', value: 'v2' },
                ]}
              />{' '}
              confirm this is the right approach.
            </p>
          </div>
        </div>
      </div>

      {/* User quick follow-up */}
      <div className="flex gap-1 justify-end">
        <div className="message-user max-w-[75%]">
          <p className="text-[9px] leading-tight">Run the dev server and make sure it compiles</p>
        </div>
        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center mt-0.5">
          <User className="w-2 h-2 text-primary-foreground" />
        </div>
      </div>

      {/* Agent with error tool call */}
      <div className="flex gap-1 justify-start">
        <div className="flex-shrink-0 w-4 h-4 rounded-full bg-muted flex items-center justify-center mt-0.5">
          <Bot className="w-2 h-2 text-muted-foreground" />
        </div>
        <div className="flex flex-col gap-1 max-w-[80%]">
          <div className="flex flex-wrap gap-0.5">
            <div className="inline-flex items-center gap-0.5 px-1 py-px rounded text-[7px] bg-muted text-muted-foreground border border-border">
              <Terminal className="w-1.5 h-1.5" />
              <span className="font-medium">shell</span>
              <span className="text-muted-foreground">—</span>
              <span className="truncate max-w-[80px]">npm run dev</span>
              <X className="w-1.5 h-1.5 text-[hsl(var(--status-error))]" />
            </div>
          </div>
          <div className="message-agent">
            <p className="text-[9px] leading-tight">Build failed — missing dependency. Let me fix that.</p>
          </div>
          <div className="flex flex-wrap gap-0.5">
            <div className="inline-flex items-center gap-0.5 px-1 py-px rounded text-[7px] bg-muted text-muted-foreground border border-border">
              <Terminal className="w-1.5 h-1.5" />
              <span className="font-medium">shell</span>
              <span className="text-muted-foreground">—</span>
              <span className="truncate max-w-[80px]">npm install</span>
              <Check className="w-1.5 h-1.5 text-[hsl(var(--status-success))]" />
            </div>
            <div className="inline-flex items-center gap-0.5 px-1 py-px rounded text-[7px] bg-[hsl(var(--status-warning)/0.08)] text-foreground border border-[hsl(var(--status-warning)/0.2)]">
              <Terminal className="w-1.5 h-1.5" />
              <span className="font-medium">shell</span>
              <span className="text-muted-foreground">—</span>
              <span className="truncate max-w-[80px]">npm run dev</span>
              <RefreshCw className="w-1.5 h-1.5 animate-spin text-[hsl(var(--status-warning))]" />
            </div>
          </div>
          <div className="message-agent">
            <p className="text-[9px] leading-tight">
              Dev server starting on localhost:5173
              <span className="inline-block w-0.5 h-2.5 bg-muted-foreground/50 animate-pulse ml-0.5 align-text-bottom" />
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}


function MiniChatInput({ paddingLeft = 12, paddingRight = 12 }: { paddingLeft?: number; paddingRight?: number }) {
  return (
    <div className="pb-2 pt-0.5" style={{ paddingLeft, paddingRight }}>
      <div className="max-w-[420px] mx-auto">
        <div className="rounded-xl bg-card border border-border shadow-lg px-3 pt-2.5 pb-2">
          {/* Placeholder text */}
          <div className="text-[8px] text-muted-foreground/50 mb-2">Type your message here...</div>
          {/* Bottom toolbar */}
          <div className="flex items-center justify-between">
            {/* Left icons */}
            <div className="flex items-center gap-0.5">
              <Paperclip className="w-2.5 h-2.5 text-muted-foreground/50" />
              <Globe className="w-2.5 h-2.5 text-muted-foreground/50 ml-1" />
              <div className="w-px h-2.5 bg-border mx-1" />
              <Settings className="w-2.5 h-2.5 text-muted-foreground/50" />
              <FolderOpen className="w-2.5 h-2.5 text-muted-foreground/50 ml-1" />
            </div>
            {/* Mic button */}
            <div className="w-5 h-5 rounded-full border border-border bg-foreground/5 flex items-center justify-center">
              <Mic className="w-2.5 h-2.5 text-foreground/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniHome({ paddingLeft = 12, paddingRight = 12 }: { paddingLeft?: number; paddingRight?: number }) {
  const today = new Date();
  const day = today.getDate();
  const hours = today.getHours() % 12 || 12;
  const minutes = today.getMinutes().toString().padStart(2, '0');
  const period = today.getHours() >= 12 ? 'pm' : 'am';

  return (
    <div className="relative flex-1 flex flex-col" style={{ paddingLeft, paddingRight }}>
      {/* Background image + PixelBlast */}
      <div className="absolute inset-0 z-0">
        <img
          src="/icons/background.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/30" />
        {/* PixelBlast overlay */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <PixelBlast
            variant="square"
            pixelSize={3}
            color="#FFFFFF"
            speed={0.08}
            patternScale={4}
            patternDensity={0.4}
            edgeFade={0.5}
            enableRipples={false}
            transparent
          />
        </div>
      </div>

      {/* Vertically centered content — left aligned near sidebar */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-3">
        <div className="w-full max-w-[320px] space-y-1.5">

          {/* Greeting */}
          <div className="mb-2">
            <GooseLogo className="text-foreground mb-1" size={8} />
            <p className="text-[13px] font-light text-foreground">Good afternoon</p>
          </div>

          {/* Time widget — full width */}
          <div className="rounded-lg bg-[#1a1a1c]/80 backdrop-blur border border-[#2a2a2c] p-2.5 flex flex-col min-h-[52px]">
            <div className="flex items-baseline gap-1">
              <span className="text-[22px] font-light font-mono text-white tracking-tight">{hours}:{minutes}</span>
              <span className="text-[9px] text-white/50">{period}</span>
            </div>
            <span className="text-[7px] text-white/30">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>

          {/* Row below time: Recent Chats, Today, Sessions */}
          <div className="grid grid-cols-3 gap-1.5">

            {/* Recent Chats */}
            <div className="rounded-lg bg-card/80 backdrop-blur border border-border p-2 flex flex-col min-h-[80px]">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="w-2 h-2" />
                  <span className="text-[6px] uppercase tracking-wider">Chats</span>
                </div>
                <span className="text-[6px] text-muted-foreground">All →</span>
              </div>
              <div className="flex-1 space-y-0.5">
                {[
                  { name: 'Tauri Migration', time: '2m', active: true },
                  { name: 'Design System', time: '1h' },
                  { name: 'Fix auth', time: '3h' },
                ].map((c) => (
                  <div key={c.name} className={cn(
                    'flex items-center justify-between px-1 py-0.5 rounded text-[7px]',
                    c.active ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground'
                  )}>
                    <span className="truncate">{c.name}</span>
                    <span className="text-[6px] text-muted-foreground/50 flex-shrink-0 ml-1">{c.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Today */}
            <div className="rounded-lg bg-card/80 backdrop-blur border border-border p-2 flex flex-col justify-between min-h-[80px]">
              <span className="text-[7px] text-[hsl(var(--status-error))] font-medium">Today</span>
              <div>
                <p className="text-[22px] font-light leading-none">{day}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-0.5 h-2.5 bg-[hsl(var(--user-accent))] rounded-full" />
                  <div>
                    <p className="text-[7px] font-medium">Design Review</p>
                    <p className="text-[6px] text-muted-foreground">2:00 pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions */}
            <div className="rounded-lg bg-card/80 backdrop-blur border border-border p-2 flex flex-col justify-between min-h-[80px]">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="w-2 h-2" />
                <span className="text-[6px] uppercase tracking-wider">Sessions</span>
              </div>
              <div>
                <p className="text-[22px] font-mono font-light leading-none">24</p>
                <p className="text-[6px] text-muted-foreground mt-1">1.2M tokens</p>
              </div>
            </div>

          </div>

          {/* New Chat button — full width */}
          <div className="rounded-lg bg-gradient-to-br from-[hsl(var(--user-accent))] to-[hsl(var(--user-accent)/0.7)] p-2 flex items-center gap-2">
            <GooseLogo className="text-white/80" size={6} />
            <div>
              <p className="text-[9px] font-medium text-white">New Chat</p>
              <p className="text-[6px] text-white/60">Start a conversation</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function MiniProjectHome({ paddingLeft = 12, paddingRight = 12 }: { paddingLeft?: number; paddingRight?: number }) {
  return (
    <div className="relative flex-1 flex flex-col" style={{ paddingLeft, paddingRight }}>
      {/* Knowledge graph as full background canvas */}
      <div className="absolute inset-0 z-0">
        <svg viewBox="0 0 700 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          {/* Connection lines — knowledge relationships */}
          <line x1="120" y1="180" x2="280" y2="120" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.4" />
          <line x1="120" y1="180" x2="200" y2="300" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.4" />
          <line x1="280" y1="120" x2="420" y2="90" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.4" />
          <line x1="280" y1="120" x2="350" y2="250" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.4" />
          <line x1="200" y1="300" x2="350" y2="250" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.4" />
          <line x1="420" y1="90" x2="560" y2="150" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.4" />
          <line x1="420" y1="90" x2="500" y2="220" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.4" />
          <line x1="350" y1="250" x2="500" y2="220" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.4" />
          <line x1="560" y1="150" x2="620" y2="280" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.4" />
          <line x1="200" y1="300" x2="320" y2="400" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          <line x1="350" y1="250" x2="320" y2="400" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          <line x1="500" y1="220" x2="580" y2="370" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          <line x1="620" y1="280" x2="580" y2="370" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          <line x1="60" y1="100" x2="120" y2="180" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          <line x1="60" y1="100" x2="150" y2="60" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          <line x1="150" y1="60" x2="280" y2="120" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          {/* New knowledge connections */}
          <line x1="150" y1="60" x2="320" y2="40" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.25" />
          <line x1="320" y1="40" x2="420" y2="90" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          <line x1="560" y1="150" x2="660" y2="120" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.25" />
          <line x1="660" y1="120" x2="650" y2="200" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.2" />
          <line x1="620" y1="280" x2="650" y2="200" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.2" />
          <line x1="60" y1="100" x2="40" y2="220" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.2" />
          <line x1="40" y1="220" x2="120" y2="180" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.25" />
          <line x1="40" y1="220" x2="100" y2="340" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.15" />
          <line x1="100" y1="340" x2="200" y2="300" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.2" />
          <line x1="500" y1="220" x2="600" y2="60" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.15" />
          <line x1="600" y1="60" x2="660" y2="120" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.2" />
          <line x1="320" y1="40" x2="460" y2="30" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.15" />
          <line x1="460" y1="30" x2="560" y2="150" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.2" />
          <line x1="460" y1="30" x2="600" y2="60" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.15" />
          <line x1="100" y1="340" x2="180" y2="420" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.15" />
          <line x1="350" y1="250" x2="260" y2="380" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.15" />
          <line x1="260" y1="380" x2="320" y2="400" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.15" />
          <line x1="500" y1="220" x2="540" y2="310" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.2" />
          <line x1="540" y1="310" x2="580" y2="370" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.15" />
          <line x1="540" y1="310" x2="620" y2="280" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.2" />
          <line x1="650" y1="200" x2="540" y2="310" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.15" />
          <line x1="260" y1="380" x2="400" y2="380" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.1" />
          <line x1="420" y1="90" x2="460" y2="30" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.2" />

          {/* Activity connection lines — linking activity to knowledge */}
          <line x1="500" y1="220" x2="480" y2="340" stroke="hsl(var(--status-success))" strokeWidth="0.4" opacity="0.3" strokeDasharray="3 3" />
          <line x1="350" y1="250" x2="400" y2="380" stroke="hsl(var(--status-info))" strokeWidth="0.4" opacity="0.3" strokeDasharray="3 3" />
          <line x1="280" y1="120" x2="180" y2="420" stroke="hsl(var(--status-warning))" strokeWidth="0.4" opacity="0.2" strokeDasharray="3 3" />

          {/* Knowledge nodes */}
          <circle cx="120" cy="180" r="8" fill="hsl(var(--status-info))" opacity="0.15" />
          <circle cx="120" cy="180" r="4" fill="hsl(var(--status-info))" opacity="0.5" />
          <circle cx="280" cy="120" r="10" fill="hsl(var(--user-accent))" opacity="0.12" />
          <circle cx="280" cy="120" r="5" fill="hsl(var(--user-accent))" opacity="0.5" />
          <circle cx="200" cy="300" r="6" fill="hsl(var(--status-success))" opacity="0.12" />
          <circle cx="200" cy="300" r="3" fill="hsl(var(--status-success))" opacity="0.4" />
          <circle cx="420" cy="90" r="8" fill="hsl(var(--status-warning))" opacity="0.12" />
          <circle cx="420" cy="90" r="4" fill="hsl(var(--status-warning))" opacity="0.4" />
          <circle cx="350" cy="250" r="7" fill="hsl(var(--status-info))" opacity="0.1" />
          <circle cx="350" cy="250" r="3.5" fill="hsl(var(--status-info))" opacity="0.35" />
          <circle cx="500" cy="220" r="6" fill="hsl(var(--status-error))" opacity="0.1" />
          <circle cx="500" cy="220" r="3" fill="hsl(var(--status-error))" opacity="0.35" />
          <circle cx="560" cy="150" r="7" fill="hsl(var(--status-success))" opacity="0.1" />
          <circle cx="560" cy="150" r="3.5" fill="hsl(var(--status-success))" opacity="0.4" />
          <circle cx="620" cy="280" r="5" fill="hsl(var(--muted-foreground))" opacity="0.08" />
          <circle cx="620" cy="280" r="2.5" fill="hsl(var(--muted-foreground))" opacity="0.2" />
          <circle cx="60" cy="100" r="6" fill="hsl(var(--status-success))" opacity="0.1" />
          <circle cx="60" cy="100" r="3" fill="hsl(var(--status-success))" opacity="0.35" />
          <circle cx="150" cy="60" r="5" fill="hsl(var(--muted-foreground))" opacity="0.08" />
          <circle cx="150" cy="60" r="2.5" fill="hsl(var(--muted-foreground))" opacity="0.2" />

          {/* New knowledge nodes */}
          <circle cx="320" cy="40" r="6" fill="hsl(var(--user-accent))" opacity="0.08" />
          <circle cx="320" cy="40" r="3" fill="hsl(var(--user-accent))" opacity="0.3" />
          <circle cx="460" cy="30" r="5" fill="hsl(var(--status-info))" opacity="0.08" />
          <circle cx="460" cy="30" r="2.5" fill="hsl(var(--status-info))" opacity="0.25" />
          <circle cx="600" cy="60" r="5" fill="hsl(var(--status-warning))" opacity="0.08" />
          <circle cx="600" cy="60" r="2.5" fill="hsl(var(--status-warning))" opacity="0.25" />
          <circle cx="660" cy="120" r="6" fill="hsl(var(--status-success))" opacity="0.08" />
          <circle cx="660" cy="120" r="3" fill="hsl(var(--status-success))" opacity="0.3" />
          <circle cx="650" cy="200" r="5" fill="hsl(var(--user-accent))" opacity="0.06" />
          <circle cx="650" cy="200" r="2.5" fill="hsl(var(--user-accent))" opacity="0.2" />
          <circle cx="40" cy="220" r="5" fill="hsl(var(--status-warning))" opacity="0.08" />
          <circle cx="40" cy="220" r="2.5" fill="hsl(var(--status-warning))" opacity="0.25" />
          <circle cx="100" cy="340" r="5" fill="hsl(var(--status-info))" opacity="0.06" />
          <circle cx="100" cy="340" r="2.5" fill="hsl(var(--status-info))" opacity="0.2" />
          <circle cx="540" cy="310" r="5" fill="hsl(var(--status-error))" opacity="0.06" />
          <circle cx="540" cy="310" r="2.5" fill="hsl(var(--status-error))" opacity="0.2" />
          <circle cx="260" cy="380" r="4" fill="hsl(var(--muted-foreground))" opacity="0.06" />
          <circle cx="260" cy="380" r="2" fill="hsl(var(--muted-foreground))" opacity="0.15" />

          {/* Knowledge labels */}
          <text x="120" y="196" textAnchor="middle" className="fill-muted-foreground/40 text-[7px]">Sidecar</text>
          <text x="280" y="108" textAnchor="middle" className="fill-muted-foreground/40 text-[7px]">Tauri v2</text>
          <text x="200" y="316" textAnchor="middle" className="fill-muted-foreground/40 text-[7px]">IPC</text>
          <text x="420" y="78" textAnchor="middle" className="fill-muted-foreground/40 text-[7px]">Auth</text>
          <text x="350" y="266" textAnchor="middle" className="fill-muted-foreground/40 text-[7px]">OAuth2</text>
          <text x="500" y="236" textAnchor="middle" className="fill-muted-foreground/40 text-[7px]">JWT</text>
          <text x="560" y="166" textAnchor="middle" className="fill-muted-foreground/40 text-[7px]">WebView</text>
          <text x="60" y="88" textAnchor="middle" className="fill-muted-foreground/40 text-[7px]">Rust</text>
          {/* New knowledge labels */}
          <text x="320" y="30" textAnchor="middle" className="fill-muted-foreground/30 text-[6px]">Vite</text>
          <text x="460" y="20" textAnchor="middle" className="fill-muted-foreground/30 text-[6px]">Bundler</text>
          <text x="600" y="50" textAnchor="middle" className="fill-muted-foreground/30 text-[6px]">HMR</text>
          <text x="660" y="108" textAnchor="middle" className="fill-muted-foreground/30 text-[6px]">React</text>
          <text x="650" y="216" textAnchor="middle" className="fill-muted-foreground/25 text-[6px]">Zustand</text>
          <text x="40" y="236" textAnchor="middle" className="fill-muted-foreground/30 text-[6px]">Cargo</text>
          <text x="100" y="356" textAnchor="middle" className="fill-muted-foreground/25 text-[6px]">WASM</text>
          <text x="540" y="326" textAnchor="middle" className="fill-muted-foreground/25 text-[6px]">PKCE</text>
          <text x="260" y="396" textAnchor="middle" className="fill-muted-foreground/20 text-[6px]">Middleware</text>

          {/* Activity nodes — recent actions as graph nodes */}
          {/* Created InlinePill.tsx */}
          <circle cx="480" cy="340" r="4" fill="hsl(var(--status-success))" opacity="0.6" />
          <circle cx="480" cy="340" r="8" fill="hsl(var(--status-success))" opacity="0.1" />
          <text x="480" y="356" textAnchor="middle" className="fill-[hsl(var(--status-success))] text-[6px]" opacity="0.6">Created InlinePill.tsx</text>

          {/* Edited Sidebar.tsx */}
          <circle cx="400" cy="380" r="3.5" fill="hsl(var(--status-info))" opacity="0.5" />
          <circle cx="400" cy="380" r="7" fill="hsl(var(--status-info))" opacity="0.08" />
          <text x="400" y="396" textAnchor="middle" className="fill-[hsl(var(--status-info))] text-[6px]" opacity="0.5">Edited Sidebar.tsx</text>

          {/* Ran npm run dev */}
          <circle cx="180" cy="420" r="3" fill="hsl(var(--status-warning))" opacity="0.4" />
          <circle cx="180" cy="420" r="6" fill="hsl(var(--status-warning))" opacity="0.06" />
          <text x="180" y="436" textAnchor="middle" className="fill-[hsl(var(--status-warning))] text-[6px]" opacity="0.4">npm run dev</text>

          {/* Searched sidecar */}
          <circle cx="320" cy="400" r="3" fill="hsl(var(--muted-foreground))" opacity="0.25" />
          <text x="320" y="416" textAnchor="middle" className="fill-muted-foreground/30 text-[6px]">Searched KB</text>

          {/* Ran cargo test */}
          <circle cx="580" cy="370" r="3" fill="hsl(var(--status-error))" opacity="0.35" />
          <text x="580" y="386" textAnchor="middle" className="fill-[hsl(var(--status-error))] text-[6px]" opacity="0.4">cargo test ✕</text>
        </svg>
      </div>

      {/* Floating widget cards on top of the graph */}
      <div className="relative z-10 py-3 px-1">
        <div className="max-w-[420px]">

          {/* Project header */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <DeveloperIcon size={14} />
              <span className="text-[11px] font-semibold">Goose 2.0</span>
              <span className="text-[7px] px-1 py-0.5 rounded bg-[hsl(var(--status-success)/0.15)] text-[hsl(var(--status-success))]">Active</span>
            </div>
            <p className="text-[8px] text-muted-foreground">~/Desktop/goose2.0 · Brian · 12 knowledge items</p>
          </div>

          {/* Widget grid */}
          <div className="grid grid-cols-3 gap-1.5">

            {/* Outstanding Tasks — 2 col span */}
            <div className="col-span-2 rounded-lg bg-card/90 backdrop-blur border border-border p-2">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1">
                  <ClipboardList className="w-2 h-2 text-muted-foreground" />
                  <span className="text-[7px] uppercase tracking-wider text-muted-foreground">Tasks</span>
                </div>
                <span className="text-[7px] text-muted-foreground">5 open</span>
              </div>
              <div className="space-y-0.5">
                {[
                  { title: 'Tauri Shell & Sidecar', priority: '🔴', status: 'In Progress' },
                  { title: 'Design System', priority: '🔴', status: 'In Progress' },
                  { title: 'Conversation UI', priority: '🟠', status: 'Todo' },
                  { title: 'Project System', priority: '🟡', status: 'Todo' },
                ].map((t) => (
                  <div key={t.title} className="flex items-center gap-1 px-1 py-0.5 rounded text-[7px] hover:bg-muted/50 transition-colors">
                    <span className="text-[6px]">{t.priority}</span>
                    <span className="truncate flex-1 text-foreground">{t.title}</span>
                    <span className="text-muted-foreground/50 flex-shrink-0">{t.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sprint progress — 1 col */}
            <div className="rounded-lg bg-card/90 backdrop-blur border border-border p-2 flex flex-col justify-between">
              <span className="text-[7px] uppercase tracking-wider text-muted-foreground">Sprint 3</span>
              <div className="my-1.5">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[16px] font-mono font-light">40</span>
                  <span className="text-[8px] text-muted-foreground">%</span>
                </div>
              </div>
              <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-[hsl(var(--status-success))]" style={{ width: '40%' }} />
              </div>
              <span className="text-[6px] text-muted-foreground mt-1">2 of 5 done</span>
            </div>

            {/* Generated Artifacts — 2 col span */}
            <div className="col-span-2 rounded-lg bg-card/90 backdrop-blur border border-border p-2">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1">
                  <FileText className="w-2 h-2 text-muted-foreground" />
                  <span className="text-[7px] uppercase tracking-wider text-muted-foreground">Artifacts</span>
                </div>
                <span className="text-[7px] text-muted-foreground">12 files</span>
              </div>
              <div className="space-y-0.5">
                {[
                  { name: 'tauri.conf.json', time: '2m ago', color: 'bg-amber-400' },
                  { name: 'Sidebar.tsx', time: '15m ago', color: 'bg-blue-400' },
                  { name: 'InlinePill.tsx', time: '1h ago', color: 'bg-blue-400' },
                  { name: 'SubagentFlow.tsx', time: '2h ago', color: 'bg-blue-400' },
                ].map((f) => (
                  <div key={f.name} className="flex items-center gap-1 px-1 py-0.5 rounded text-[7px] hover:bg-muted/50 transition-colors">
                    <span className={cn('w-1 h-1 rounded-full flex-shrink-0', f.color)} />
                    <span className="font-mono truncate flex-1 text-foreground">{f.name}</span>
                    <span className="text-muted-foreground/40 flex-shrink-0">{f.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sessions — 1 col */}
            <div className="rounded-lg bg-card/90 backdrop-blur border border-border p-2 flex flex-col justify-between">
              <div className="flex items-center gap-1">
                <MessageSquare className="w-2 h-2 text-muted-foreground" />
                <span className="text-[7px] uppercase tracking-wider text-muted-foreground">Sessions</span>
              </div>
              <p className="text-[16px] font-mono font-light">24</p>
              <span className="text-[6px] text-muted-foreground">18.4K tokens</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function MiniStatusBar() {
  return (
    <div className="flex items-center gap-1.5 px-2.5 h-5 border-t border-border bg-card text-[7px] text-muted-foreground">
      <AgentBurst size={7} color="#D4845A" />
      <span>Claude 3.5 Sonnet</span>
      <span className="opacity-30">·</span>
      <span>1,247 tokens</span>
      <div className="flex-1" />
      <Wrench className="w-2 h-2" />
      <span>5 extensions</span>
    </div>
  );
}

function MiniAppPanel({ variant = 'editor' }: { variant?: 'editor' | 'tracker' }) {
  if (variant === 'tracker') {
    return (
      <div className="flex flex-col h-full w-[260px] bg-card border border-border rounded-l-xl shadow-xl">
        {/* Panel header — app tabs */}
        <div className="flex items-center justify-between px-2 py-1.5 border-b border-border">
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted text-foreground">
              <ClipboardList className="w-2.5 h-2.5" />
              Point A
            </div>
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] text-muted-foreground">
              <Brain className="w-2.5 h-2.5" />
              Brian
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <ExternalLink className="w-2.5 h-2.5 text-muted-foreground" />
            <PanelRightClose className="w-2.5 h-2.5 text-muted-foreground" />
          </div>
        </div>
        {/* Issue tracker content */}
        <div className="flex-1 overflow-hidden p-2 space-y-1.5">
          <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Sprint 3 — In Progress</div>
          {[
            { title: 'Tauri Shell & Sidecar', priority: '🔴', status: 'In Progress', assignee: 'SM' },
            { title: 'Design System', priority: '🔴', status: 'In Progress', assignee: 'SM' },
            { title: 'Conversation UI', priority: '🟠', status: 'Todo', assignee: '—' },
            { title: 'Project System', priority: '🟡', status: 'Todo', assignee: '—' },
            { title: 'Command Screen', priority: '🟡', status: 'Backlog', assignee: '—' },
          ].map((issue) => (
            <div key={issue.title} className="flex items-start gap-1.5 px-1.5 py-1 rounded-md border border-border bg-background text-[9px] hover:border-muted-foreground/30 transition-colors cursor-pointer">
              <span>{issue.priority}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate text-foreground">{issue.title}</div>
                <div className="text-muted-foreground">{issue.status}</div>
              </div>
              <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[6px] font-medium">{issue.assignee}</span>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-border text-[8px] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--status-success))]" />
            <span>Context bridge active</span>
          </div>
        </div>
      </div>
    );
  }

  // Default: Document Editor / Code Viewer sidecar
  return (
    <div className="flex flex-col h-full w-[280px] bg-card border border-border rounded-l-xl shadow-xl">
      {/* Panel header — app tabs */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-border">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted text-foreground">
            <FileText className="w-2.5 h-2.5" />
            Document Editor
          </div>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] text-muted-foreground">
            <ClipboardList className="w-2.5 h-2.5" />
            Point A
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <ExternalLink className="w-2.5 h-2.5 text-muted-foreground" />
          <PanelRightClose className="w-2.5 h-2.5 text-muted-foreground" />
        </div>
      </div>

      {/* Document title bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border bg-muted/30">
        <span className="text-[10px] font-medium text-foreground">tauri.conf.json</span>
        <span className="text-[8px] text-muted-foreground/60">— Goose 2.0</span>
        <div className="flex-1" />
        <span className="text-[8px] px-1 py-0.5 rounded bg-[hsl(var(--status-warning)/0.15)] text-[hsl(var(--status-warning))]">Modified</span>
      </div>

      {/* Code editor content */}
      <div className="flex-1 overflow-hidden font-mono text-[8px] leading-[14px]">
        {/* Line numbers + code */}
        <div className="flex h-full">
          {/* Line numbers */}
          <div className="flex flex-col items-end px-1.5 py-2 text-muted-foreground/40 select-none border-r border-border bg-muted/20 flex-shrink-0">
            {Array.from({ length: 18 }, (_, i) => (
              <span key={i} className={i === 5 || i === 6 ? 'text-foreground/60' : ''}>{i + 1}</span>
            ))}
          </div>
          {/* Code content */}
          <div className="flex-1 py-2 px-2 overflow-hidden">
            <div className="text-muted-foreground">{'{'}</div>
            <div className="pl-3"><span className="text-[hsl(var(--status-info))]">"build"</span>: {'{'}</div>
            <div className="pl-6"><span className="text-[hsl(var(--status-info))]">"devPath"</span>: <span className="text-[hsl(var(--status-success))]">"http://localhost:5173"</span>,</div>
            <div className="pl-6"><span className="text-[hsl(var(--status-info))]">"distDir"</span>: <span className="text-[hsl(var(--status-success))]">"../frontend/dist"</span></div>
            <div className="pl-3">{'}'},</div>
            <div className="pl-3 bg-[hsl(var(--status-success)/0.08)] -mx-2 px-2 border-l-2 border-[hsl(var(--status-success))]"><span className="text-[hsl(var(--status-info))]">"package"</span>: {'{'}</div>
            <div className="pl-6 bg-[hsl(var(--status-success)/0.08)] -mx-2 px-2 border-l-2 border-[hsl(var(--status-success))]"><span className="text-[hsl(var(--status-info))]">"productName"</span>: <span className="text-[hsl(var(--status-success))]">"Goose"</span>,</div>
            <div className="pl-6"><span className="text-[hsl(var(--status-info))]">"version"</span>: <span className="text-[hsl(var(--status-success))]">"2.0.0"</span></div>
            <div className="pl-3">{'}'},</div>
            <div className="pl-3"><span className="text-[hsl(var(--status-info))]">"tauri"</span>: {'{'}</div>
            <div className="pl-6"><span className="text-[hsl(var(--status-info))]">"bundle"</span>: {'{'}</div>
            <div className="pl-9"><span className="text-[hsl(var(--status-info))]">"active"</span>: <span className="text-[hsl(var(--status-warning))]">true</span>,</div>
            <div className="pl-9"><span className="text-[hsl(var(--status-info))]">"targets"</span>: <span className="text-[hsl(var(--status-success))]">"all"</span></div>
            <div className="pl-6">{'}'},</div>
            <div className="pl-6"><span className="text-[hsl(var(--status-info))]">"windows"</span>: [{'{'}</div>
            <div className="pl-9"><span className="text-[hsl(var(--status-info))]">"title"</span>: <span className="text-[hsl(var(--status-success))]">"Goose 2.0"</span>,</div>
            <div className="pl-9"><span className="text-[hsl(var(--status-info))]">"width"</span>: <span className="text-[hsl(var(--status-warning))]">1200</span></div>
          </div>
        </div>
      </div>

      {/* Editor footer — status */}
      <div className="flex items-center gap-2 px-2 py-1 border-t border-border text-[8px] text-muted-foreground">
        <span>JSON</span>
        <span className="opacity-30">·</span>
        <span>UTF-8</span>
        <span className="opacity-30">·</span>
        <span>Ln 7, Col 24</span>
        <div className="flex-1" />
        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--status-success))]" />
        <span>Synced with Goose</span>
      </div>
    </div>
  );
}

/** Full app preview at a given size — floating panel layout */
function AppPreviewFrame({
  label,
  width,
  height,
  showAppPanel = false,
  collapsedSidebar = false,
  sidecarVariant = 'editor',
  contentView = 'chat',
  navPosition = 'left',
  navStyle = 'condensed',
}: {
  label: string;
  width: number;
  height: number;
  showAppPanel?: boolean;
  collapsedSidebar?: boolean;
  sidecarVariant?: 'editor' | 'tracker';
  contentView?: 'chat' | 'home' | 'project' | 'subagents';
  navPosition?: 'left' | 'right' | 'top' | 'bottom';
  navStyle?: 'condensed' | 'tiles';
}) {
  const isHorizontalNav = navPosition === 'top' || navPosition === 'bottom';
  const chromeHeight = 28;
  const tabsHeight = isHorizontalNav ? 0 : 32;
  const statusHeight = 20;
  // Horizontal nav takes ~36px; vertical nav doesn't consume vertical space
  const navBarHeight = isHorizontalNav ? 36 : 0;
  const contentHeight = height - chromeHeight - tabsHeight - statusHeight - navBarHeight;
  const sidecarWidth = sidecarVariant === 'editor' ? 292 : 272;

  // Padding for chat content — only needed for vertical (left/right) sidebar
  const chatPaddingLeft = isHorizontalNav ? 12 : (collapsedSidebar ? 56 : 220);
  const chatPaddingRight = showAppPanel ? sidecarWidth + 12 : 12;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-[10px] text-muted-foreground font-mono">{width} × {height}</span>
      </div>
      <div
        className="border border-border rounded-xl overflow-hidden shadow-lg bg-background"
        style={{ width, height }}
      >
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-3 bg-card border-b border-border" style={{ height: chromeHeight }}>
          <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--status-error))]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--status-warning))]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[hsl(var(--status-success))]" />
          <span className="text-[9px] text-muted-foreground ml-2 font-medium">Goose 2.0</span>
        </div>

        {/* Session tabs — only for vertical nav layouts */}
        {!isHorizontalNav && <MiniSessionTabs />}

        {/* Horizontal nav bar — top position */}
        {isHorizontalNav && navPosition === 'top' && (
          <div className="overflow-hidden" style={{ height: navBarHeight }}>
            <div className="origin-top-left" style={{ transform: 'scale(0.85)', width: width / 0.85, height: navBarHeight / 0.85 }}>
              <Sidebar position={navPosition} navStyle={navStyle} width={240} />
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="relative" style={{ height: contentHeight }}>
          {/* Content — full width base layer, padded to clear floating panels */}
          <div className="absolute inset-0 flex flex-col">
            {contentView === 'home' ? (
              <MiniHome
                paddingLeft={chatPaddingLeft}
                paddingRight={chatPaddingRight}
              />
            ) : contentView === 'project' ? (
              <MiniProjectHome
                paddingLeft={chatPaddingLeft}
                paddingRight={chatPaddingRight}
              />
            ) : contentView === 'subagents' ? (
              <>
                <div className="flex-1 overflow-hidden">
                  <div
                    className="origin-top-left"
                    style={{
                      transform: 'scale(0.7)',
                      width: `${100 / 0.7}%`,
                      height: `${100 / 0.7}%`,
                    }}
                  >
                    <InfiniteCanvas
                      className="h-full"
                      hideControls={true}
                      messages={[
                        { role: 'system', content: 'Session started — auth refactor' },
                        { role: 'user', content: 'Review the auth module and run tests in parallel', timestamp: '2:34 PM' },
                        { role: 'agent', content: "I'll delegate to 3 subagents.", timestamp: '2:34 PM' },
                        { role: 'agent', content: 'Synthesis complete. 2 failing tests found.', timestamp: '2:35 PM' },
                      ]}
                      delegations={[
                        {
                          afterMessageIndex: 2,
                          threads: [
                            {
                              id: 'research',
                              name: 'Research',
                              status: 'completed',
                              duration: '4.2s',
                              messages: [
                                { role: 'system', content: 'Spawned' },
                                { role: 'agent', content: 'Found 3 patterns.', timestamp: '2:35 PM' },
                              ],
                              tools: [
                                { name: 'search_knowledge', description: 'Auth patterns', status: 'completed', duration: '0.8s' },
                              ],
                              result: 'JWT, session tokens, OAuth2',
                            },
                            {
                              id: 'review',
                              name: 'Code Review',
                              status: 'running',
                              messages: [
                                { role: 'system', content: 'Spawned' },
                                { role: 'agent', content: 'Building call graph...', timestamp: '2:34 PM' },
                              ],
                              tools: [
                                { name: 'analyze', description: 'auth.rs', status: 'completed', duration: '1.4s' },
                                { name: 'text_editor', description: 'Token validation', status: 'running' },
                              ],
                            },
                            {
                              id: 'tests',
                              name: 'Test Runner',
                              status: 'error',
                              duration: '2.8s',
                              messages: [
                                { role: 'system', content: 'Spawned' },
                                { role: 'agent', content: '2 tests failing', timestamp: '2:35 PM' },
                              ],
                              tools: [
                                { name: 'shell', description: 'cargo test', status: 'error' },
                              ],
                              error: '2 tests failing',
                            },
                          ],
                          mergeStatus: 'completed',
                          mergeResult: 'Synthesis complete.',
                        },
                      ]}
                      onSend={(msg, threadId) => console.log('Send to', threadId || 'main', ':', msg)}
                    />
                  </div>
                </div>
                <MiniChatInput
                  paddingLeft={chatPaddingLeft}
                  paddingRight={chatPaddingRight}
                />
              </>
            ) : (
              <>
                <MiniConversation
                  paddingLeft={chatPaddingLeft}
                  paddingRight={chatPaddingRight}
                />
                <MiniChatInput
                  paddingLeft={chatPaddingLeft}
                  paddingRight={chatPaddingRight}
                />
              </>
            )}
          </div>

          {/* Floating sidebar — vertical positions only */}
          {!isHorizontalNav && (
            <div
              className={cn(
                'absolute z-10',
                'top-2 bottom-2',
                'overflow-hidden',
                navPosition === 'left' ? 'left-2' : 'right-2',
                !collapsedSidebar && 'rounded-xl shadow-xl',
                collapsedSidebar && 'rounded-lg shadow-lg',
              )}
              style={{ width: collapsedSidebar ? 42 : 204 }}
            >
              <div
                className="origin-top-left"
                style={{
                  transform: 'scale(0.85)',
                  width: collapsedSidebar ? 48 / 0.85 : 240,
                  height: `${100 / 0.85}%`,
                }}
              >
                <Sidebar
                  collapsed={collapsedSidebar}
                  width={240}
                  position={navPosition}
                  navStyle={navStyle}
                  className="h-full"
                />
              </div>
            </div>
          )}

          {/* Floating sidecar app — overlays on the right */}
          {showAppPanel && (
            <div className="absolute top-2 right-0 bottom-2 z-10">
              <MiniAppPanel variant={sidecarVariant} />
            </div>
          )}
        </div>

        {/* Horizontal nav bar — bottom position */}
        {isHorizontalNav && navPosition === 'bottom' && (
          <div className="overflow-hidden" style={{ height: navBarHeight }}>
            <div className="origin-top-left" style={{ transform: 'scale(0.85)', width: width / 0.85, height: navBarHeight / 0.85 }}>
              <Sidebar position={navPosition} navStyle={navStyle} width={240} />
            </div>
          </div>
        )}

        {/* Status bar — full width */}
        <MiniStatusBar />
      </div>
    </div>
  );
}

// ─── Interactive Sidebar Playground ─────────────────────────
function SidebarPlaygroundSection({
  isDark,
  onToggleTheme,
  onCommandOpen,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
  onCommandOpen: () => void;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [navStyle, setNavStyle] = useState<'condensed' | 'tiles'>('condensed');
  const [navPosition, setNavPosition] = useState<'left' | 'right' | 'top' | 'bottom'>('left');

  const isHorizontal = navPosition === 'top' || navPosition === 'bottom';

  return (
    <Section id="sidebar" title="Sidebar" icon={PanelLeft}>
      <p className="text-[13px] text-muted-foreground mb-4">
        Navigation can be docked to any edge of the viewport. Vertical (left/right) supports
        condensed, tiles, and collapsed modes. Horizontal (top/bottom) renders as a compact nav bar.
      </p>

      {/* Position controls */}
      <SubSection title="Position">
        <div className="flex items-center gap-1.5 mb-4">
          {(['left', 'top', 'right', 'bottom'] as const).map((pos) => (
            <Button
              key={pos}
              variant={navPosition === pos ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setNavPosition(pos); setSidebarCollapsed(false); }}
            >
              {pos.charAt(0).toUpperCase() + pos.slice(1)}
            </Button>
          ))}
        </div>
      </SubSection>

      {/* Style controls — only for vertical positions */}
      {!isHorizontal && (
        <SubSection title="Style">
          <div className="flex items-center gap-1.5 mb-4">
            <Button
              variant={!sidebarCollapsed && navStyle === 'condensed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setSidebarCollapsed(false); setNavStyle('condensed'); }}
            >
              Condensed
            </Button>
            <Button
              variant={!sidebarCollapsed && navStyle === 'tiles' ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setSidebarCollapsed(false); setNavStyle('tiles'); }}
            >
              Tiles
            </Button>
            <Button
              variant={sidebarCollapsed ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSidebarCollapsed(true)}
            >
              Collapsed
            </Button>
            <span className="text-[10px] text-muted-foreground ml-2">⌘B to toggle</span>
          </div>
        </SubSection>
      )}

      {/* Sidebar preview */}
      <SubSection title="Preview">
        <div
          className={cn(
            'border border-border rounded-lg overflow-hidden',
            isHorizontal ? 'w-full' : 'h-[580px] w-fit',
          )}
        >
          <Sidebar
            collapsed={isHorizontal ? false : sidebarCollapsed}
            position={navPosition}
            navStyle={navStyle}
            onNavStyleChange={(style) => setNavStyle(style)}
            isDark={isDark}
            onToggleTheme={onToggleTheme}
            onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            onSearch={onCommandOpen}
          />
        </div>
      </SubSection>
    </Section>
  );
}

// ─── Main Playground ───────────────────────────────────────
export function Playground() {
  const [isDark, setIsDark] = useState(true);
  const [commandOpen, setCommandOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('typography');

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const scrollTo = (id: string) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={cn('flex h-screen bg-background text-foreground', isDark && 'dark')}>
      {/* Left nav */}
      <nav className="w-56 border-r border-border bg-card flex flex-col flex-shrink-0">
        <div className="px-4 py-3 border-b border-border">
          <h1 className="text-sm font-semibold">Component Playground</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">Goose 2.0 Design System</p>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={cn(
                  'flex items-center gap-2 w-full px-4 py-1.5 text-[13px] transition-colors',
                  activeNav === item.id
                    ? 'text-foreground font-medium bg-muted'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
        <div className="px-4 py-3 border-t border-border">
          <Button variant="ghost" size="sm" onClick={toggleTheme} className="w-full justify-start">
            {isDark ? <Sun className="w-3.5 h-3.5 mr-2" /> : <Moon className="w-3.5 h-3.5 mr-2" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* ═══ FULL APP PREVIEW ═══ */}
          <Section id="app-preview" title="Full App Preview" icon={Monitor}>
            <p className="text-[13px] text-muted-foreground mb-6">
              Self-contained mockups of the complete app layout at different viewport sizes.
              These show how sidebar, session tabs, conversation, tool calls, artifacts, chat input,
              status bar, and app panel compose together.
            </p>

            <SubSection title="Home — Widget dashboard landing page">
              <AppPreviewFrame
                label="Home Dashboard"
                width={960}
                height={700}
                contentView="home"
                collapsedSidebar
              />
            </SubSection>

            <SubSection title="Project Home — Tasks, artifacts, and knowledge graph">
              <AppPreviewFrame
                label="Project Dashboard"
                width={960}
                height={740}
                contentView="project"
              />
            </SubSection>

            <SubSection title="Default — Sidebar + Conversation">
              <AppPreviewFrame
                label="Standard Window"
                width={960}
                height={700}
              />
            </SubSection>

            <SubSection title="Sidecar: Code Editor — full app working alongside chat">
              <AppPreviewFrame
                label="Document Editor Sidecar"
                width={1120}
                height={700}
                showAppPanel
                sidecarVariant="editor"
              />
            </SubSection>

            <SubSection title="Sidecar: Issue Tracker — Point A alongside chat">
              <AppPreviewFrame
                label="Point A Tracker Sidecar"
                width={1060}
                height={700}
                showAppPanel
                sidecarVariant="tracker"
              />
            </SubSection>

            <SubSection title="Compact — Collapsed Sidebar + Editor Sidecar">
              <AppPreviewFrame
                label="Collapsed + Sidecar"
                width={960}
                height={640}
                collapsedSidebar
                showAppPanel
                sidecarVariant="editor"
              />
            </SubSection>

            <SubSection title="Subagent Delegation — Parallel task branching in conversation">
              <AppPreviewFrame
                label="Subagent Flow"
                width={960}
                height={640}
                contentView="subagents"
              />
            </SubSection>

            <SubSection title="Top Nav Bar — Horizontal navigation docked to top">
              <AppPreviewFrame
                label="Top Nav + Conversation"
                width={960}
                height={700}
                navPosition="top"
                navStyle="tiles"
              />
            </SubSection>

            <SubSection title="Chat Only — No Sidecar">
              <AppPreviewFrame
                label="Focused Chat"
                width={680}
                height={620}
                collapsedSidebar
              />
            </SubSection>
          </Section>

          {/* ═══ TYPOGRAPHY ═══ */}
          <Section id="typography" title="Typography" icon={Type}>
            <SubSection title="Scale">
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-muted-foreground font-mono">20px / semibold</span>
                  <p className="text-[20px] font-semibold">Title — The quick brown fox</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-mono">15px / semibold</span>
                  <p className="text-[15px] font-semibold">Heading — The quick brown fox</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-mono">13px / normal</span>
                  <p className="text-[13px]">Body — The quick brown fox jumps over the lazy dog. This is the primary reading size used throughout the application.</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-mono">11px / medium</span>
                  <p className="text-[11px] font-medium text-muted-foreground">Caption — The quick brown fox jumps over the lazy dog</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-mono">13px / mono</span>
                  <p className="text-[13px] font-mono">Code — const goose = new Agent();</p>
                </div>
              </div>
            </SubSection>

            <SubSection title="Weights">
              <div className="space-y-1 text-[13px]">
                <p className="font-normal">400 Normal — Regular body text</p>
                <p className="font-medium">500 Medium — Emphasized text, labels</p>
                <p className="font-semibold">600 Semibold — Headings, titles</p>
              </div>
            </SubSection>
          </Section>

          {/* ═══ COLORS ═══ */}
          <Section id="colors" title="Colors" icon={Palette}>
            <SubSection title="Backgrounds">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: 'Background', cls: 'bg-background', token: '--background' },
                  { name: 'Card', cls: 'bg-card', token: '--card' },
                  { name: 'Muted', cls: 'bg-muted', token: '--muted' },
                  { name: 'Secondary', cls: 'bg-secondary', token: '--secondary' },
                ].map((c) => (
                  <div key={c.name} className="text-center">
                    <div className={cn('h-16 rounded-lg border border-border', c.cls)} />
                    <p className="text-[11px] font-medium mt-1.5">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{c.token}</p>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Text">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { name: 'Foreground', cls: 'text-foreground', sample: 'Aa' },
                  { name: 'Muted', cls: 'text-muted-foreground', sample: 'Aa' },
                  { name: 'Card FG', cls: 'text-card-foreground', sample: 'Aa' },
                  { name: 'Accent', cls: 'accent-text', sample: 'Aa' },
                ].map((c) => (
                  <div key={c.name} className="text-center">
                    <div className="h-16 rounded-lg border border-border flex items-center justify-center bg-card">
                      <span className={cn('text-2xl font-semibold', c.cls)}>{c.sample}</span>
                    </div>
                    <p className="text-[11px] font-medium mt-1.5">{c.name}</p>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Status">
              <div className="flex gap-4">
                {[
                  { name: 'Success', color: 'hsl(var(--status-success))' },
                  { name: 'Warning', color: 'hsl(var(--status-warning))' },
                  { name: 'Error', color: 'hsl(var(--status-error))' },
                  { name: 'Info', color: 'hsl(var(--status-info))' },
                ].map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                    <span className="text-xs">{s.name}</span>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Borders & Accents">
              <div className="flex gap-3">
                <div className="px-4 py-3 rounded-lg border border-border text-xs">Default border</div>
                <div className="px-4 py-3 rounded-lg accent-border border text-xs">Accent border</div>
                <div className="px-4 py-3 rounded-lg accent-bg text-xs accent-text">Accent background</div>
                <div className="flex items-center gap-2 px-4 py-3">
                  <span className="accent-dot" />
                  <span className="text-xs">Accent dot</span>
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ═══ BUTTONS & INPUTS ═══ */}
          <Section id="buttons" title="Buttons & Inputs" icon={MousePointer2}>
            <SubSection title="Button Variants">
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </SubSection>

            <SubSection title="Button Sizes">
              <div className="flex items-center gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Terminal className="w-4 h-4" /></Button>
                <Button size="icon-sm"><Terminal className="w-3.5 h-3.5" /></Button>
              </div>
            </SubSection>

            <SubSection title="Button States">
              <div className="flex gap-2">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
              </div>
            </SubSection>

            <SubSection title="Badges">
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="muted">Muted</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </SubSection>

            <SubSection title="Input">
              <div className="max-w-sm space-y-2">
                <Input placeholder="Default input..." />
                <Input placeholder="Disabled input..." disabled />
              </div>
            </SubSection>
          </Section>

          {/* ═══ TOOL CALL PILLS ═══ */}
          <Section id="tool-pills" title="Tool Call Pills" icon={Terminal}>
            <SubSection title="States">
              <div className="space-y-2">
                <ToolCallPill
                  toolName="developer.analyze"
                  description="Analyzing project structure"
                  status="completed"
                  duration="1.2s"
                  input='{ "path": "/Users/spencer/goose2.0" }'
                  output="Found 61 files across 7 directories..."
                />
                <ToolCallPill
                  toolName="developer.text_editor"
                  description="Creating tauri.conf.json"
                  status="completed"
                  duration="0.3s"
                />
                <ToolCallPill
                  toolName="developer.shell"
                  description="Running cargo init"
                  status="executing"
                />
                <ToolCallPill
                  toolName="developer.shell"
                  description="Build failed"
                  status="error"
                  output="error[E0433]: failed to resolve: use of undeclared crate..."
                />
                <ToolCallPill
                  toolName="brian.search"
                  description="Searching knowledge base"
                  status="idle"
                />
              </div>
            </SubSection>

            <SubSection title="Inline Flow (as they appear in conversation)">
              <div className="bg-card rounded-lg p-4 border border-border">
                <p className="text-[13px] mb-3">I'll set up the Tauri project. Let me start by analyzing the existing structure.</p>
                <div className="flex flex-wrap gap-1.5">
                  <ToolCallPill toolName="developer.analyze" description="Analyzing project structure" status="completed" duration="1.2s" />
                  <ToolCallPill toolName="developer.text_editor" description="Creating tauri.conf.json" status="completed" duration="0.3s" />
                  <ToolCallPill toolName="developer.shell" description="Running cargo init" status="executing" />
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ═══ SUBAGENT FLOW ═══ */}
          <Section id="subagent-flow" title="Subagent Flow" icon={GitBranch}>
            <p className="text-[13px] text-muted-foreground mb-4">
              Gitflow-style visualization of parallel subagent delegation. Shows branching when the
              main agent delegates tasks, tool execution within each branch, and the merge/synthesis point.
            </p>

            <SubSection title="Mixed States — Completed, Running, Error">
              <SubagentFlow
                instruction="Decompose → async delegates → sleep → synthesize. Research the codebase, review auth patterns, and run the test suite in parallel."
                branches={[
                  {
                    id: 'research',
                    name: 'Research — codebase patterns',
                    description: 'Explore the existing architecture and find relevant patterns for the auth refactor',
                    status: 'completed',
                    model: 'claude-3.5-sonnet',
                    duration: '4.2s',
                    tools: [
                      { toolName: 'brian__search_knowledge', description: 'Searching "auth middleware patterns"', status: 'completed', duration: '0.8s' },
                      { toolName: 'developer__analyze', description: 'Analyzing src/middleware/', status: 'completed', duration: '1.1s' },
                      { toolName: 'developer__text_editor', description: 'Reading src/middleware/auth.rs', status: 'completed', duration: '0.3s' },
                    ],
                    result: 'Found 3 relevant patterns: JWT validation, session tokens, and OAuth2 PKCE flow. The current auth.rs uses a custom middleware chain.',
                    isAsync: true,
                  },
                  {
                    id: 'review',
                    name: 'Code review — auth.rs',
                    description: 'Review the current auth middleware implementation for security issues and improvement opportunities',
                    status: 'running',
                    model: 'claude-3.5-sonnet',
                    tools: [
                      { toolName: 'developer__analyze', description: 'Analyzing auth.rs call graph', status: 'completed', duration: '1.4s' },
                      { toolName: 'developer__text_editor', description: 'Reading token validation logic', status: 'running' },
                    ],
                    isAsync: true,
                  },
                  {
                    id: 'tests',
                    name: 'Test runner — cargo test',
                    description: 'Run the existing test suite to establish a baseline before making changes',
                    status: 'error',
                    model: 'claude-3.5-sonnet',
                    duration: '2.8s',
                    tools: [
                      { toolName: 'developer__shell', description: 'Running cargo test --workspace', status: 'error' },
                    ],
                    error: 'cargo test failed: 2 tests failing in auth::tests — token_expiry_check and refresh_token_rotation',
                    isAsync: true,
                  },
                ]}
                mergeStatus="running"
              />
            </SubSection>

            <SubSection title="All Completed — Synthesis Done">
              <SubagentFlow
                instruction="Review the PR changes across frontend and backend, check for breaking changes."
                branches={[
                  {
                    id: 'frontend',
                    name: 'Frontend review',
                    description: 'Check React component changes and TypeScript types',
                    status: 'completed',
                    duration: '3.1s',
                    tools: [
                      { toolName: 'developer__analyze', description: 'Analyzing src/components/', status: 'completed', duration: '1.2s' },
                      { toolName: 'developer__text_editor', description: 'Reading ChatView.tsx diff', status: 'completed', duration: '0.4s' },
                    ],
                    result: 'Frontend changes look clean. New ChatView padding logic is correct.',
                  },
                  {
                    id: 'backend',
                    name: 'Backend review',
                    description: 'Check Rust API changes and database migrations',
                    status: 'completed',
                    duration: '2.7s',
                    tools: [
                      { toolName: 'developer__analyze', description: 'Analyzing crates/goose-server/', status: 'completed', duration: '1.5s' },
                      { toolName: 'developer__shell', description: 'Running cargo clippy', status: 'completed', duration: '0.9s' },
                    ],
                    result: 'Backend is clean. No breaking API changes. Clippy passes.',
                  },
                ]}
                mergeStatus="completed"
                mergeResult="PR is safe to merge. No breaking changes detected across frontend or backend. All tests pass."
              />
            </SubSection>

            <SubSection title="Pending — Waiting to Start">
              <SubagentFlow
                instruction="Set up the complete CI/CD pipeline: configure GitHub Actions, Docker builds, and deployment scripts."
                branches={[
                  {
                    id: 'gh-actions',
                    name: 'GitHub Actions config',
                    description: 'Create workflow files for CI/CD',
                    status: 'pending',
                    tools: [],
                  },
                  {
                    id: 'docker',
                    name: 'Docker build setup',
                    description: 'Create Dockerfile and compose config',
                    status: 'pending',
                    tools: [],
                  },
                  {
                    id: 'deploy',
                    name: 'Deployment scripts',
                    description: 'Create deploy scripts for staging and production',
                    status: 'pending',
                    tools: [],
                  },
                ]}
                mergeStatus="pending"
                defaultExpanded={false}
              />
            </SubSection>
          </Section>

          {/* ═══ INFINITE CANVAS ═══ */}
          <Section id="infinite-canvas" title="Infinite Canvas" icon={Maximize2}>
            <p className="text-[13px] text-muted-foreground mb-4">
              Conversation lives on an infinite canvas. The main thread runs vertically while subagent
              threads branch to the right as parallel columns. Zoom out to see all threads working
              simultaneously, zoom in to focus on the main conversation. ⌘+scroll to zoom, drag to pan.
            </p>

            <SubSection title="Parallel Delegation — 3 threads branching from main">
                <InfiniteCanvas
                  className="h-[700px]"
                  messages={[
                    { role: 'system', content: 'Session started — auth refactor' },
                    { role: 'user', content: 'Review the auth module, research best practices, and run the test suite — do it all in parallel', timestamp: '2:34 PM' },
                    { role: 'agent', content: "I'll delegate this to 3 subagents running in parallel. Each will handle a different aspect of the task.", timestamp: '2:34 PM' },
                    { role: 'agent', content: 'Here\'s the synthesis from all 3 branches: The auth module uses a custom middleware chain. JWT validation is solid but refresh token rotation has 2 failing tests.', timestamp: '2:35 PM' },
                    { role: 'user', content: 'Fix the failing tests and update the token rotation logic', timestamp: '2:36 PM' },
                  ]}
                  delegations={[
                    {
                      afterMessageIndex: 2,
                      threads: [
                        {
                          id: 'research',
                          name: 'Research',
                          status: 'completed',
                          duration: '4.2s',
                          messages: [
                            { role: 'system', content: 'Subagent spawned' },
                            { role: 'agent', content: 'Searching knowledge base for auth middleware patterns...', timestamp: '2:34 PM' },
                            { role: 'agent', content: 'Found relevant patterns. Analyzing source directory structure.', timestamp: '2:34 PM' },
                            { role: 'agent', content: 'Identified 3 common patterns in the codebase: JWT validation, session tokens, and OAuth2 PKCE flow.', timestamp: '2:35 PM' },
                          ],
                          tools: [
                            { name: 'search_knowledge', description: 'Auth middleware patterns', status: 'completed', duration: '0.8s' },
                            { name: 'analyze', description: 'src/middleware/', status: 'completed', duration: '1.1s' },
                            { name: 'text_editor', description: 'Reading auth.rs', status: 'completed', duration: '0.3s' },
                          ],
                          result: 'Found 3 patterns: JWT, session tokens, OAuth2 PKCE',
                        },
                        {
                          id: 'review',
                          name: 'Code Review',
                          status: 'running',
                          messages: [
                            { role: 'system', content: 'Subagent spawned' },
                            { role: 'agent', content: 'Building call graph for auth.rs to understand the module structure...', timestamp: '2:34 PM' },
                            { role: 'agent', content: 'Call graph complete. Now reviewing token validation logic in detail.', timestamp: '2:35 PM' },
                          ],
                          tools: [
                            { name: 'analyze', description: 'auth.rs call graph', status: 'completed', duration: '1.4s' },
                            { name: 'text_editor', description: 'Token validation logic', status: 'running' },
                          ],
                        },
                        {
                          id: 'tests',
                          name: 'Test Runner',
                          status: 'error',
                          duration: '2.8s',
                          messages: [
                            { role: 'system', content: 'Subagent spawned' },
                            { role: 'agent', content: 'Running full test suite with cargo test --workspace...', timestamp: '2:34 PM' },
                            { role: 'agent', content: 'Test run complete. Found 2 failing tests in the auth::tests module related to token refresh rotation.', timestamp: '2:35 PM' },
                          ],
                          tools: [
                            { name: 'shell', description: 'cargo test --workspace', status: 'error' },
                          ],
                          error: '2 tests failing in auth::tests',
                        },
                      ],
                      mergeStatus: 'completed',
                      mergeResult: 'Synthesis complete — auth module reviewed, patterns identified, 2 test failures found.',
                    },
                  ]}
                  onSend={(msg, threadId) => console.log('Send to', threadId || 'main', ':', msg)}
                />
            </SubSection>
          </Section>

          {/* ═══ THINKING BLOCK ═══ */}
          <Section id="thinking" title="Thinking Block" icon={Brain}>
            <SubSection title="Collapsed (default)">
              <ThinkingBlock
                content="I need to create the Tauri v2 project structure. Let me analyze the existing codebase first to understand the workspace layout, then set up the sidecar configuration for goosed..."
              />
            </SubSection>

            <SubSection title="Expanded">
              <ThinkingBlock
                content="I need to create the Tauri v2 project structure. Let me analyze the existing codebase first to understand the workspace layout, then set up the sidecar configuration for goosed. The key files I need to create are tauri.conf.json, the Rust main.rs entry point, and the frontend scaffold with Vite."
                defaultExpanded
              />
            </SubSection>

            <SubSection title="Streaming">
              <ThinkingBlock
                content="I need to create the Tauri v2 project structure..."
                isStreaming
                defaultExpanded
              />
            </SubSection>
          </Section>

          {/* ═══ MESSAGES ═══ */}
          <Section id="messages" title="Message Bubbles" icon={MessageSquare}>
            <div className="space-y-4 bg-background rounded-lg p-4 border border-border">
              <MessageBubble role="system">Session started — Goose 2.0 project</MessageBubble>

              <MessageBubble role="user" timestamp="2:34 PM">
                Can you set up the Tauri project structure and configure the sidecar?
              </MessageBubble>

              <MessageBubble role="agent" timestamp="2:34 PM">
                I'll set up the Tauri project. Let me start by analyzing the existing structure.
              </MessageBubble>

              <MessageBubble role="user" timestamp="2:35 PM">
                Now check Point A for the current sprint status
              </MessageBubble>

              <MessageBubble role="agent" timestamp="2:35 PM">
                Let me check Point A for the current sprint status...
              </MessageBubble>
            </div>
          </Section>

          {/* ═══ INLINE PILLS ═══ */}
          <Section id="inline-pills" title="Inline Pills" icon={Globe}>
            <p className="text-[13px] text-muted-foreground mb-4">
              Rich inline references that sit within flowing text. Hover to see a popover
              with a preview — website screenshot, file contents, issue details, or knowledge snippets.
            </p>

            <SubSection title="Agent Response with Inline References">
              <div className="bg-card rounded-lg p-5 border border-border max-w-2xl">
                <p className="text-[13px] leading-relaxed text-foreground">
                  I looked into the payment integration and found that{' '}
                  <InlinePill
                    type="link"
                    label="Square"
                    href="https://square.ca"
                    subtitle="Square — Commerce solutions for every business"
                    previewContent="Square helps millions of sellers run their business — from secure credit card processing to point of sale solutions. Get started today."
                    meta={[
                      { label: 'Type', value: 'Website' },
                      { label: 'Status', value: '200 OK' },
                    ]}
                  />{' '}
                  provides a comprehensive API for handling transactions. Their documentation at{' '}
                  <InlinePill
                    type="link"
                    label="Developer Docs"
                    href="https://developer.squareup.com"
                    subtitle="Square Developer Platform"
                    previewContent="Build with Square APIs and SDKs. Accept payments, manage inventory, and run your business with powerful developer tools."
                    meta={[
                      { label: 'API Version', value: '2024-01' },
                      { label: 'SDKs', value: 'Node, Python, Ruby' },
                    ]}
                  />{' '}
                  covers the OAuth2 flow we need.
                </p>

                <p className="text-[13px] leading-relaxed text-foreground mt-3">
                  I updated the config in{' '}
                  <InlinePill
                    type="file"
                    label="payments.config.ts"
                    subtitle="src/config/payments.config.ts"
                    previewContent={`export const paymentsConfig = {\n  provider: 'square',\n  environment: 'sandbox',\n  applicationId: process.env.SQ_APP_ID,\n  locationId: process.env.SQ_LOCATION_ID,\n};`}
                    meta={[
                      { label: 'Lines', value: '24' },
                      { label: 'Modified', value: 'Just now' },
                    ]}
                  />{' '}
                  and the related issue{' '}
                  <InlinePill
                    type="issue"
                    label="GOOSE-42"
                    subtitle="Integrate Square payment processing"
                    previewContent="Set up Square SDK, implement OAuth2 flow, create payment endpoints, and add webhook handlers for transaction events."
                    meta={[
                      { label: 'Status', value: 'In Progress' },
                      { label: 'Priority', value: 'High' },
                      { label: 'Assignee', value: 'SM' },
                    ]}
                  />{' '}
                  tracks the remaining work. I also found a relevant note in{' '}
                  <InlinePill
                    type="knowledge"
                    label="Payment Architecture"
                    subtitle="Brian Knowledge Base"
                    previewContent="The payment system uses a provider-agnostic adapter pattern. Each provider (Square, Stripe) implements the PaymentProvider interface with methods for charge, refund, and webhook verification."
                    meta={[
                      { label: 'Source', value: 'Brian' },
                      { label: 'Updated', value: '2 days ago' },
                    ]}
                  />{' '}
                  that describes the adapter pattern we should follow.
                </p>

                <p className="text-[13px] leading-relaxed text-foreground mt-3">
                  The webhook handler lives in{' '}
                  <InlinePill
                    type="code"
                    label="handleWebhook()"
                    subtitle="src/api/webhooks.ts:47"
                    previewContent={`async function handleWebhook(req: Request) {\n  const signature = req.headers['x-square-signature'];\n  const isValid = verifySignature(signature, req.body);\n  if (!isValid) throw new WebhookError('Invalid signature');\n  // Process event...\n}`}
                    meta={[
                      { label: 'Language', value: 'TypeScript' },
                      { label: 'Line', value: '47' },
                    ]}
                  />{' '}
                  and I ran{' '}
                  <InlinePill
                    type="command"
                    label="npm test -- --grep webhook"
                    subtitle="Shell command"
                    previewContent="PASS  src/api/__tests__/webhooks.test.ts\n  ✓ validates Square webhook signature (12ms)\n  ✓ rejects invalid signatures (3ms)\n  ✓ processes payment.completed event (8ms)\n\nTest Suites: 1 passed, 1 total\nTests:       3 passed, 3 total"
                    meta={[
                      { label: 'Exit', value: '0' },
                      { label: 'Duration', value: '1.4s' },
                    ]}
                  />{' '}
                  to verify everything passes.
                </p>
              </div>
            </SubSection>

            <SubSection title="All Pill Types">
              <div className="flex flex-wrap gap-3 items-center">
                <InlinePill type="link" label="Square" href="https://square.ca" subtitle="Commerce platform" />
                <InlinePill type="file" label="App.tsx" subtitle="src/App.tsx" previewContent="The main application entry point." meta={[{ label: 'Lines', value: '142' }]} />
                <InlinePill type="issue" label="GOOSE-42" subtitle="Payment integration" meta={[{ label: 'Status', value: 'In Progress' }]} />
                <InlinePill type="knowledge" label="Auth Patterns" subtitle="Brian KB" previewContent="JWT, session tokens, OAuth2 PKCE" />
                <InlinePill type="code" label="createServer()" subtitle="server.ts:12" previewContent="function createServer(port: number) { ... }" />
                <InlinePill type="command" label="cargo test" subtitle="Shell" previewContent="All 47 tests passed." meta={[{ label: 'Exit', value: '0' }]} />
              </div>
            </SubSection>
          </Section>

          {/* ═══ ARTIFACT CARDS ═══ */}
          <Section id="artifacts" title="Artifact Cards" icon={FileText}>
            <SubSection title="File Tree">
              <ArtifactCard
                title="Project Structure Created"
                type="file-tree"
                content={`ui/tauri/
├── src-tauri/
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── src/main.rs
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/App.tsx`}
                actions={[
                  { label: 'Open in Editor', onClick: () => {} },
                  { label: 'View Files', onClick: () => {} },
                ]}
              />
            </SubSection>

            <SubSection title="Code">
              <ArtifactCard
                title="tauri.conf.json"
                type="code"
                language="json"
                content={`{
  "build": {
    "devPath": "http://localhost:5173",
    "distDir": "../frontend/dist"
  },
  "package": {
    "productName": "Goose",
    "version": "2.0.0"
  }
}`}
              />
            </SubSection>

            <SubSection title="Collapsed">
              <ArtifactCard
                title="Build Output"
                type="document"
                content="Compiled successfully in 2.3s"
                defaultExpanded={false}
              />
            </SubSection>
          </Section>

          {/* ═══ APP CARDS ═══ */}
          <Section id="app-cards" title="App Cards" icon={CreditCard}>
            <SubSection title="Point A — Issue Tracker">
              <AppCard
                appName="Point A"
                appId="point-a"
                subtitle="Goose 2.0"
                status="connected"
                issues={[
                  { title: 'Tauri Shell & Sidecar', status: 'todo', priority: 'urgent' },
                  { title: 'Design System — Brian', status: 'todo', priority: 'urgent' },
                  { title: 'Conversation UI', status: 'todo', priority: 'urgent' },
                  { title: 'Project System', status: 'todo', priority: 'high' },
                  { title: 'Command Screen', status: 'todo', priority: 'high' },
                ]}
                onOpenPanel={() => {}}
                onViewAll={() => {}}
              />
            </SubSection>

            <SubSection title="Brian — Knowledge Base">
              <AppCard
                appName="Brian"
                appId="brian"
                subtitle="Knowledge Base"
                status="connected"
                onOpenPanel={() => {}}
              />
            </SubSection>

            <SubSection title="Disconnected State">
              <AppCard
                appName="Point A"
                appId="point-a"
                status="disconnected"
              />
            </SubSection>

            <SubSection title="Analytics — Token Usage Chart">
              <div className="rounded-lg border border-border bg-card overflow-hidden max-w-md">
                <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-b from-violet-400 to-violet-600 flex items-center justify-center">
                      <Terminal className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-[12px] font-medium">Token Usage</p>
                      <p className="text-[10px] text-muted-foreground">Last 7 days · Goose 2.0</p>
                    </div>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--status-success))]" />
                </div>
                <div className="px-3 py-3">
                  {/* Stats row */}
                  <div className="flex items-baseline gap-4 mb-3">
                    <div>
                      <p className="text-[20px] font-mono font-light">18.4K</p>
                      <p className="text-[10px] text-muted-foreground">Total tokens</p>
                    </div>
                    <div>
                      <p className="text-[14px] font-mono font-light text-[hsl(var(--status-success))]">↑ 23%</p>
                      <p className="text-[10px] text-muted-foreground">vs last week</p>
                    </div>
                  </div>
                  {/* Bar chart */}
                  <div className="flex items-end gap-1 h-[60px]">
                    {[
                      { day: 'Mon', h: 35, color: 'bg-[hsl(var(--user-accent))]' },
                      { day: 'Tue', h: 55, color: 'bg-[hsl(var(--user-accent))]' },
                      { day: 'Wed', h: 42, color: 'bg-[hsl(var(--user-accent))]' },
                      { day: 'Thu', h: 68, color: 'bg-[hsl(var(--user-accent))]' },
                      { day: 'Fri', h: 85, color: 'bg-[hsl(var(--user-accent))]' },
                      { day: 'Sat', h: 25, color: 'bg-muted-foreground/30' },
                      { day: 'Sun', h: 48, color: 'bg-[hsl(var(--user-accent)/0.6)]' },
                    ].map((bar) => (
                      <div key={bar.day} className="flex-1 flex flex-col items-center gap-1">
                        <div className={cn('w-full rounded-sm', bar.color)} style={{ height: `${bar.h}%` }} />
                        <span className="text-[7px] text-muted-foreground">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                  {/* Breakdown */}
                  <div className="flex gap-3 mt-3 pt-2 border-t border-border/50 text-[10px]">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--status-info))]" />
                      <span className="text-muted-foreground">Input</span>
                      <span className="font-mono">12.1K</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--user-accent))]" />
                      <span className="text-muted-foreground">Output</span>
                      <span className="font-mono">6.3K</span>
                    </div>
                  </div>
                </div>
              </div>
            </SubSection>

            <SubSection title="Map — Deployment Regions">
              <div className="rounded-lg border border-border bg-card overflow-hidden max-w-md">
                <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-b from-emerald-400 to-emerald-600 flex items-center justify-center">
                      <Globe className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-[12px] font-medium">Deployment Regions</p>
                      <p className="text-[10px] text-muted-foreground">3 active · 2 standby</p>
                    </div>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--status-success))]" />
                </div>
                <div className="px-3 py-3">
                  {/* Simplified world map */}
                  <svg viewBox="0 0 400 200" className="w-full h-[120px] mb-2">
                    {/* Simplified continent outlines */}
                    <path d="M80,60 Q90,40 120,45 Q140,35 160,50 Q170,55 165,70 Q155,80 140,75 Q120,80 100,75 Q85,70 80,60Z" fill="hsl(var(--muted))" opacity="0.3" />
                    <path d="M170,50 Q200,30 240,35 Q270,30 290,45 Q300,60 285,75 Q270,80 250,70 Q230,65 210,70 Q190,75 175,65 Q170,55 170,50Z" fill="hsl(var(--muted))" opacity="0.3" />
                    <path d="M290,45 Q310,35 340,40 Q360,50 355,65 Q345,75 330,70 Q310,65 295,55 Q290,50 290,45Z" fill="hsl(var(--muted))" opacity="0.3" />
                    <path d="M100,85 Q110,80 130,90 Q140,100 135,115 Q120,125 105,115 Q95,105 100,85Z" fill="hsl(var(--muted))" opacity="0.25" />
                    <path d="M300,80 Q320,70 345,85 Q355,100 340,120 Q320,130 305,115 Q295,100 300,80Z" fill="hsl(var(--muted))" opacity="0.25" />
                    <path d="M340,120 Q360,115 380,130 Q385,150 370,165 Q350,170 340,155 Q335,140 340,120Z" fill="hsl(var(--muted))" opacity="0.2" />

                    {/* Region markers — active */}
                    {/* US East */}
                    <circle cx="130" cy="55" r="6" fill="hsl(var(--status-success))" opacity="0.15" />
                    <circle cx="130" cy="55" r="3" fill="hsl(var(--status-success))" opacity="0.8" />
                    {/* EU West */}
                    <circle cx="210" cy="48" r="6" fill="hsl(var(--status-success))" opacity="0.15" />
                    <circle cx="210" cy="48" r="3" fill="hsl(var(--status-success))" opacity="0.8" />
                    {/* Asia Pacific */}
                    <circle cx="340" cy="55" r="6" fill="hsl(var(--status-success))" opacity="0.15" />
                    <circle cx="340" cy="55" r="3" fill="hsl(var(--status-success))" opacity="0.8" />

                    {/* Region markers — standby */}
                    {/* US West */}
                    <circle cx="95" cy="52" r="4" fill="hsl(var(--status-warning))" opacity="0.1" />
                    <circle cx="95" cy="52" r="2" fill="hsl(var(--status-warning))" opacity="0.5" />
                    {/* South America */}
                    <circle cx="140" cy="110" r="4" fill="hsl(var(--status-warning))" opacity="0.1" />
                    <circle cx="140" cy="110" r="2" fill="hsl(var(--status-warning))" opacity="0.5" />

                    {/* Connection lines between active regions */}
                    <line x1="130" y1="55" x2="210" y2="48" stroke="hsl(var(--status-success))" strokeWidth="0.5" opacity="0.3" strokeDasharray="4 4" />
                    <line x1="210" y1="48" x2="340" y2="55" stroke="hsl(var(--status-success))" strokeWidth="0.5" opacity="0.3" strokeDasharray="4 4" />

                    {/* Labels */}
                    <text x="130" y="68" textAnchor="middle" className="fill-muted-foreground text-[7px]">US-E</text>
                    <text x="210" y="38" textAnchor="middle" className="fill-muted-foreground text-[7px]">EU-W</text>
                    <text x="340" y="68" textAnchor="middle" className="fill-muted-foreground text-[7px]">AP-SE</text>
                    <text x="95" y="42" textAnchor="middle" className="fill-muted-foreground/60 text-[6px]">US-W</text>
                    <text x="140" y="123" textAnchor="middle" className="fill-muted-foreground/60 text-[6px]">SA</text>
                  </svg>
                  {/* Region list */}
                  <div className="space-y-1">
                    {[
                      { name: 'US East (Virginia)', latency: '12ms', status: 'active', color: 'bg-[hsl(var(--status-success))]' },
                      { name: 'EU West (Frankfurt)', latency: '28ms', status: 'active', color: 'bg-[hsl(var(--status-success))]' },
                      { name: 'Asia Pacific (Tokyo)', latency: '45ms', status: 'active', color: 'bg-[hsl(var(--status-success))]' },
                      { name: 'US West (Oregon)', latency: '—', status: 'standby', color: 'bg-[hsl(var(--status-warning))]' },
                      { name: 'South America (São Paulo)', latency: '—', status: 'standby', color: 'bg-[hsl(var(--status-warning))]' },
                    ].map((r) => (
                      <div key={r.name} className="flex items-center gap-2 text-[11px]">
                        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', r.color)} />
                        <span className="flex-1 truncate">{r.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{r.latency}</span>
                        <span className={cn('text-[9px] px-1 py-0.5 rounded', r.status === 'active' ? 'bg-[hsl(var(--status-success)/0.1)] text-[hsl(var(--status-success))]' : 'bg-muted text-muted-foreground')}>{r.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SubSection>

            <SubSection title="Activity — Sparkline Timeline">
              <div className="rounded-lg border border-border bg-card overflow-hidden max-w-md">
                <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center">
                      <Wrench className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-[12px] font-medium">Session Activity</p>
                      <p className="text-[10px] text-muted-foreground">24 sessions · last 30 days</p>
                    </div>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--status-success))]" />
                </div>
                <div className="px-3 py-3">
                  {/* Sparkline */}
                  <svg viewBox="0 0 400 80" className="w-full h-[50px] mb-2">
                    {/* Area fill */}
                    <path d="M0,70 L13,65 L27,60 L40,55 L53,58 L67,45 L80,50 L93,40 L107,35 L120,42 L133,30 L147,25 L160,28 L173,20 L187,22 L200,15 L213,18 L227,12 L240,15 L253,10 L267,14 L280,8 L293,12 L307,10 L320,15 L333,12 L347,18 L360,14 L373,10 L387,8 L400,5 L400,80 L0,80Z" fill="hsl(var(--user-accent))" opacity="0.08" />
                    {/* Line */}
                    <polyline points="0,70 13,65 27,60 40,55 53,58 67,45 80,50 93,40 107,35 120,42 133,30 147,25 160,28 173,20 187,22 200,15 213,18 227,12 240,15 253,10 267,14 280,8 293,12 307,10 320,15 333,12 347,18 360,14 373,10 387,8 400,5" fill="none" stroke="hsl(var(--user-accent))" strokeWidth="1.5" opacity="0.6" />
                    {/* Current point */}
                    <circle cx="400" cy="5" r="3" fill="hsl(var(--user-accent))" opacity="0.8" />
                    <circle cx="400" cy="5" r="6" fill="hsl(var(--user-accent))" opacity="0.15" />
                  </svg>
                  {/* Metrics row */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {[
                      { label: 'Sessions', value: '24', trend: '↑' },
                      { label: 'Tokens', value: '18.4K', trend: '↑' },
                      { label: 'Tools', value: '142', trend: '↑' },
                      { label: 'Errors', value: '3', trend: '↓' },
                    ].map((m) => (
                      <div key={m.label}>
                        <p className="text-[14px] font-mono font-light">{m.value}</p>
                        <p className="text-[9px] text-muted-foreground">{m.label} <span className={m.trend === '↑' ? 'text-[hsl(var(--status-success))]' : 'text-[hsl(var(--status-error))]'}>{m.trend}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ═══ CHAT INPUT ═══ */}
          <Section id="chat-input" title="Chat Input" icon={LayoutGrid}>
            <SubSection title="Default">
              <div className="border border-border rounded-lg overflow-hidden">
                <ChatInput
                  modelName="Claude 3.5 Sonnet"
                  tokenCount={1247}
                  extensions={['developer', 'brian', 'pointa']}
                  onCommandOpen={() => setCommandOpen(true)}
                  onSend={(msg) => console.log('Send:', msg)}
                />
              </div>
            </SubSection>

            <SubSection title="Minimal (no status bar)">
              <div className="border border-border rounded-lg overflow-hidden">
                <ChatInput
                  placeholder="Quick message..."
                  onSend={(msg) => console.log('Send:', msg)}
                />
              </div>
            </SubSection>
          </Section>

          {/* ═══ SESSION TABS ═══ */}
          <Section id="session-tabs" title="Session Tabs" icon={LayoutGrid}>
            <p className="text-[13px] text-muted-foreground mb-4">
              The PixelBlast background reflects session status — color and animation speed change
              to give an ambient, at-a-glance indicator of what's happening.
            </p>

            <SubSection title="Idle — Default (neutral, slow)">
              <div className="border border-border rounded-lg overflow-hidden">
                <SessionTabs
                  status="idle"
                  tabs={[
                    { id: '1', title: 'New Session', isActive: true },
                  ]}
                  onNew={() => {}}
                />
              </div>
            </SubSection>

            <SubSection title="Working — Agent active (blue, faster)">
              <div className="border border-border rounded-lg overflow-hidden">
                <SessionTabs
                  status="working"
                  tabs={[
                    { id: '1', title: 'Tauri Migration', isActive: true },
                    { id: '2', title: 'Design System', hasChanges: true },
                  ]}
                  onSelect={(id) => console.log('Select:', id)}
                  onClose={(id) => console.log('Close:', id)}
                  onNew={() => console.log('New tab')}
                />
              </div>
            </SubSection>

            <SubSection title="Complete — Session finished (green, calm)">
              <div className="border border-border rounded-lg overflow-hidden">
                <SessionTabs
                  status="complete"
                  tabs={[
                    { id: '1', title: 'Tauri Migration', isActive: true },
                    { id: '2', title: 'API Review' },
                  ]}
                  onSelect={(id) => console.log('Select:', id)}
                  onClose={(id) => console.log('Close:', id)}
                />
              </div>
            </SubSection>

            <SubSection title="Error — Something went wrong (red)">
              <div className="border border-border rounded-lg overflow-hidden">
                <SessionTabs
                  status="error"
                  tabs={[
                    { id: '1', title: 'Build Failed', isActive: true },
                  ]}
                  onNew={() => {}}
                />
              </div>
            </SubSection>

            <SubSection title="Waiting — Needs your input (yellow)">
              <div className="border border-border rounded-lg overflow-hidden">
                <SessionTabs
                  status="waiting"
                  tabs={[
                    { id: '1', title: 'Tauri Migration', isActive: true, hasChanges: true },
                    { id: '2', title: 'Design System' },
                    { id: '3', title: 'API Review' },
                  ]}
                  onSelect={(id) => console.log('Select:', id)}
                  onClose={(id) => console.log('Close:', id)}
                  onNew={() => console.log('New tab')}
                />
              </div>
            </SubSection>
          </Section>

          {/* ═══ SIDEBAR ═══ */}
          <SidebarPlaygroundSection
            isDark={isDark}
            onToggleTheme={toggleTheme}
            onCommandOpen={() => setCommandOpen(true)}
          />

          {/* ═══ COMMAND SCREEN ═══ */}
          <Section id="command" title="Command Screen" icon={Command}>
            <SubSection title="Trigger">
              <Button variant="outline" onClick={() => setCommandOpen(true)}>
                <Command className="w-3.5 h-3.5 mr-2" />
                Open Command Screen
                <kbd className="ml-3 text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
              </Button>
            </SubSection>
          </Section>
        </div>
      </main>

      {/* Command Screen Overlay */}
      <CommandScreen isOpen={commandOpen} onClose={() => setCommandOpen(false)} />
    </div>
  );
}
