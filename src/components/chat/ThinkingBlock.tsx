import { useState } from 'react';
import { Brain, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ThinkingBlockProps {
  content: string;
  isStreaming?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

export function ThinkingBlock({
  content,
  isStreaming = false,
  defaultExpanded = false,
  className,
}: ThinkingBlockProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={cn('animate-fade-in', className)}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 select-none"
      >
        {/* Small icon-in-circle — matches app icon / favicon pattern */}
        <span
          className={cn(
            'flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0',
            isStreaming
              ? 'bg-[hsl(var(--status-warning)/0.12)]'
              : 'bg-muted'
          )}
        >
          <Brain
            className={cn(
              'w-2.5 h-2.5',
              isStreaming ? 'text-[hsl(var(--status-warning))]' : 'text-muted-foreground'
            )}
          />
        </span>
        <span className="font-medium">
          {isStreaming ? 'Thinking...' : 'Thought process'}
        </span>
        {isStreaming && (
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[hsl(var(--status-warning))] animate-pulse-subtle" />
        )}
        {expanded ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
      </button>

      {expanded && (
        <div className="thinking-block mt-2 ml-[26px] animate-fade-in">
          <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{content}</p>
          {isStreaming && (
            <span className="inline-block w-1 h-4 bg-muted-foreground/50 animate-pulse-subtle ml-0.5 align-text-bottom" />
          )}
        </div>
      )}
    </div>
  );
}
