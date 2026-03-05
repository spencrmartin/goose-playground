import { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  LoaderCircle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { getToolIcon } from '../icons/ToolIcons';

const toolPillVariants = cva(
  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-all duration-150 cursor-pointer select-none',
  {
    variants: {
      status: {
        idle: 'bg-muted text-muted-foreground border-border',
        executing:
          'bg-[hsl(var(--status-warning)/0.08)] text-foreground border-[hsl(var(--status-warning)/0.2)]',
        completed: 'bg-muted text-muted-foreground border-border',
        error:
          'bg-[hsl(var(--status-error)/0.08)] text-foreground border-[hsl(var(--status-error)/0.2)]',
      },
    },
    defaultVariants: {
      status: 'idle',
    },
  }
);

/**
 * Generate a contextual description of what the tool is doing,
 * matching the Goose main branch getToolDescription() pattern.
 */
function formatToolDescription(toolName: string, description?: string): string {
  if (description) return description;

  // Extract the actual tool name (after the last __ or .)
  const shortName = toolName.includes('__')
    ? toolName.substring(toolName.lastIndexOf('__') + 2)
    : toolName.includes('.')
      ? toolName.substring(toolName.lastIndexOf('.') + 1)
      : toolName;

  // Convert snake_case to Title Case
  return shortName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get the extension/provider name for tooltip display.
 */
function getExtensionName(toolName: string): string | null {
  const lastIndex = toolName.lastIndexOf('__');
  if (lastIndex !== -1) return toolName.substring(0, lastIndex);
  const dotIndex = toolName.lastIndexOf('.');
  if (dotIndex !== -1) return toolName.substring(0, dotIndex);
  return null;
}

export interface ToolCallPillProps extends VariantProps<typeof toolPillVariants> {
  toolName: string;
  description: string;
  status: 'idle' | 'executing' | 'completed' | 'error';
  duration?: string;
  input?: string;
  output?: string;
  className?: string;
}

export function ToolCallPill({
  toolName,
  description,
  status,
  duration,
  input,
  output,
  className,
}: ToolCallPillProps) {
  const [expanded, setExpanded] = useState(false);
  const extensionName = getExtensionName(toolName);
  const toolDescription = formatToolDescription(toolName, description);
  const IconComponent = getToolIcon(toolName);

  return (
    <div className={cn('inline-block', className)}>
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(toolPillVariants({ status }), 'hover:bg-accent hover:text-accent-foreground')}
        title={extensionName ? `${extensionName} extension` : undefined}
      >
        {/* Tool-specific icon or loading spinner */}
        <span className="flex items-center justify-center flex-shrink-0">
          {status === 'executing' ? (
            <LoaderCircle className="w-[11px] h-[11px] animate-spin text-[hsl(var(--status-warning))]" />
          ) : (
            <IconComponent size={11} />
          )}
        </span>

        {/* Tool description */}
        <span className="truncate max-w-[250px]">{toolDescription}</span>

        {/* Duration */}
        {duration && (
          <span className="text-muted-foreground text-[10px] ml-1 flex-shrink-0">{duration}</span>
        )}

        {/* Expand toggle */}
        {(input || output) && (
          expanded ? (
            <ChevronDown className="w-3 h-3 ml-0.5 text-muted-foreground flex-shrink-0" />
          ) : (
            <ChevronRight className="w-3 h-3 ml-0.5 text-muted-foreground flex-shrink-0" />
          )
        )}
      </button>

      {expanded && (input || output) && (
        <div className="mt-1.5 ml-1 p-3 rounded-md bg-muted border border-border text-xs font-mono animate-fade-in">
          {input && (
            <div className="mb-2">
              <div className="text-muted-foreground font-sans font-medium mb-1">Tool Details</div>
              <pre className="whitespace-pre-wrap text-foreground/80 overflow-x-auto">{input}</pre>
            </div>
          )}
          {output && (
            <div>
              <div className="text-muted-foreground font-sans font-medium mb-1">Output</div>
              <pre className="whitespace-pre-wrap text-foreground/80 overflow-x-auto">{output}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
