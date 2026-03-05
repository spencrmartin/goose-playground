/**
 * SubagentFlow — Parallel thread visualization of subagent delegation.
 *
 * Matches the preview style: threads displayed as side-by-side columns,
 * each with a status-colored header, vertical trunk line, bordered tool
 * step cards, and result/error text with colored left borders.
 *
 * Visual pattern:
 *   ● Research        ◐ Code Review      ✕ Test Runner
 *   │ search_knowledge │ analyze          │ shell
 *   │ analyze          │ text_editor...   ✕ 2 tests failing
 *   │ text_editor      │
 *   ✓ Found 3 patterns │
 */

import { useState } from 'react';
import {
  GitBranch,
  GitMerge,
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { getToolIcon } from '../icons/ToolIcons';

type SubagentStatus = 'running' | 'completed' | 'error' | 'pending';

interface ToolStep {
  toolName: string;
  description: string;
  status: 'completed' | 'running' | 'error';
  duration?: string;
}

interface SubagentBranch {
  id: string;
  name: string;
  description?: string;
  status: SubagentStatus;
  model?: string;
  tools: ToolStep[];
  result?: string;
  error?: string;
  duration?: string;
  isAsync?: boolean;
}

export interface SubagentFlowProps {
  /** The parent instruction that triggered delegation */
  instruction: string;
  /** Branches — each represents a delegated subagent */
  branches: SubagentBranch[];
  /** Whether the merge/synthesis step is complete */
  mergeStatus: 'pending' | 'running' | 'completed';
  /** The synthesized result after all branches complete */
  mergeResult?: string;
  /** Whether the flow is expanded by default */
  defaultExpanded?: boolean;
  className?: string;
}

const dotBorderColor: Record<SubagentStatus, string> = {
  completed: 'border-[hsl(var(--status-success))]',
  running: 'border-[hsl(var(--status-warning))]',
  error: 'border-[hsl(var(--status-error))]',
  pending: 'border-muted-foreground/30',
};

const resultBorderColor: Record<SubagentStatus, string> = {
  completed: 'border-[hsl(var(--status-success))]',
  running: 'border-[hsl(var(--status-warning))]',
  error: 'border-[hsl(var(--status-error))]',
  pending: 'border-muted-foreground/30',
};

const resultTextColor: Record<SubagentStatus, string> = {
  completed: 'text-foreground/80',
  running: 'text-foreground/80',
  error: 'text-[hsl(var(--status-error))]',
  pending: 'text-muted-foreground',
};

/** Single thread column — matches the preview mini thread style */
function ThreadColumn({ branch }: { branch: SubagentBranch }) {
  return (
    <div className="flex-shrink-0 min-w-[180px] max-w-[240px]">
      {/* Header: status dot + branch icon + name + duration/spinner */}
      <div className="flex items-center gap-1.5 mb-2 px-0.5">
        <div className={cn(
          'w-2 h-2 rounded-full border-[1.5px] bg-background flex-shrink-0',
          dotBorderColor[branch.status],
        )} />
        <GitBranch className="w-3 h-3 text-muted-foreground flex-shrink-0" />
        <span className="text-[12px] font-medium text-foreground truncate">{branch.name}</span>
        {branch.status === 'running' ? (
          <RefreshCw className="w-3 h-3 animate-spin text-[hsl(var(--status-warning))] ml-auto flex-shrink-0" />
        ) : branch.duration ? (
          <span className="text-[10px] text-muted-foreground font-mono ml-auto flex-shrink-0">{branch.duration}</span>
        ) : null}
      </div>

      {/* Trunk line + tool steps */}
      <div className="relative ml-[3px] pl-4">
        {/* Vertical trunk line */}
        <div className="absolute left-[3px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-1.5">
          {/* Tool steps */}
          {branch.tools.map((tool, i) => {
            const IconComponent = getToolIcon(tool.toolName);
            return (
              <div key={i} className="rounded border border-border px-2.5 py-1.5">
                <div className="flex items-center gap-1.5">
                  {tool.status === 'running' ? (
                    <RefreshCw className="w-3 h-3 animate-spin text-[hsl(var(--status-warning))] flex-shrink-0" />
                  ) : (
                    <IconComponent size={12} className="flex-shrink-0" />
                  )}
                  <span className={cn(
                    'text-[11px] truncate',
                    tool.status === 'running' ? 'text-foreground' : 'text-muted-foreground',
                  )}>
                    {tool.description}
                  </span>
                  {tool.duration && (
                    <span className="text-[9px] text-muted-foreground/50 font-mono ml-auto flex-shrink-0">{tool.duration}</span>
                  )}
                </div>
              </div>
            );
          })}

          {/* Result or error — colored left border */}
          {branch.result && (
            <div className={cn(
              'px-2.5 py-1.5 text-[11px] border-l-2 ml-[-17px] pl-[17px]',
              resultBorderColor[branch.status],
              resultTextColor[branch.status],
            )}>
              {branch.result}
            </div>
          )}
          {branch.error && (
            <div className={cn(
              'px-2.5 py-1.5 text-[11px] border-l-2 ml-[-17px] pl-[17px]',
              resultBorderColor.error,
              resultTextColor.error,
            )}>
              {branch.error}
            </div>
          )}

          {/* Pending placeholder */}
          {branch.status === 'pending' && branch.tools.length === 0 && (
            <div className="px-2.5 py-1.5 text-[11px] text-muted-foreground/40 italic">
              Waiting to start...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SubagentFlow({
  instruction,
  branches,
  mergeStatus,
  mergeResult,
  defaultExpanded = true,
  className,
}: SubagentFlowProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const completedCount = branches.filter((b) => b.status === 'completed').length;
  const totalCount = branches.length;

  return (
    <div className={cn('rounded-lg border border-border bg-card overflow-hidden', className)}>
      {/* Header — collapsible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 w-full px-3 py-2.5 text-left hover:bg-muted/30 transition-colors"
      >
        <GitBranch className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="text-[13px] font-medium flex-1">Delegated to {totalCount} subagents</span>
        <span className="text-[10px] text-muted-foreground font-mono">
          {completedCount}/{totalCount} done
        </span>
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="animate-fade-in">
          {/* Instruction */}
          <p className="text-[11px] text-muted-foreground px-4 pb-3">{instruction}</p>

          {/* Thread columns — horizontal scroll */}
          <div className="overflow-x-auto px-4 pb-3">
            <div className="flex gap-4">
              {branches.map((branch) => (
                <ThreadColumn key={branch.id} branch={branch} />
              ))}
            </div>
          </div>

          {/* Merge point */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border bg-muted/20">
            <div className={cn(
              'w-2 h-2 rounded-full border-[1.5px] bg-background flex-shrink-0',
              mergeStatus === 'completed' ? 'border-[hsl(var(--status-success))] bg-[hsl(var(--status-success))]' :
              mergeStatus === 'running' ? 'border-[hsl(var(--status-warning))]' :
              'border-muted-foreground/30',
            )} />
            <GitMerge className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-[12px] font-medium">
              {mergeStatus === 'completed' ? 'Synthesized' :
               mergeStatus === 'running' ? 'Synthesizing...' :
               'Waiting for branches'}
            </span>
            {mergeStatus === 'running' && (
              <Loader2 className="w-3 h-3 animate-spin text-[hsl(var(--status-warning))]" />
            )}
            {mergeStatus === 'completed' && (
              <Check className="w-3 h-3 text-[hsl(var(--status-success))]" />
            )}
          </div>

          {/* Merge result */}
          {mergeResult && mergeStatus === 'completed' && (
            <div className="px-4 py-2 text-[11px] text-muted-foreground border-t border-border">
              {mergeResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
