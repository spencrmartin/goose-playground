import { useState } from 'react';
import {
  Bot,
  Copy,
  Check,
  Pencil,
  GitFork,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface MessageAction {
  id: string;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

export interface MessageBubbleProps {
  role: 'user' | 'agent' | 'system';
  children: React.ReactNode;
  timestamp?: string;
  onCopy?: () => void;
  onEdit?: () => void;
  onFork?: () => void;
  onRetry?: () => void;
  onDelete?: () => void;
  actions?: MessageAction[];
  className?: string;
}

function MessageActions({
  role,
  onCopy,
  onEdit,
  onFork,
  onRetry,
  onDelete,
  actions: customActions,
}: Pick<MessageBubbleProps, 'role' | 'onCopy' | 'onEdit' | 'onFork' | 'onRetry' | 'onDelete' | 'actions'>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy?.();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build action list based on role
  const actions: MessageAction[] = customActions || [];

  if (!customActions) {
    // Copy is always available
    if (onCopy) {
      actions.push({
        id: 'copy',
        icon: copied ? Check : Copy,
        label: copied ? 'Copied' : 'Copy',
        onClick: handleCopy,
      });
    }

    if (role === 'user') {
      if (onEdit) actions.push({ id: 'edit', icon: Pencil, label: 'Edit', onClick: onEdit });
    }

    if (role === 'agent') {
      if (onRetry) actions.push({ id: 'retry', icon: RotateCcw, label: 'Retry', onClick: onRetry });
      if (onFork) actions.push({ id: 'fork', icon: GitFork, label: 'Fork', onClick: onFork });
    }

    if (onDelete) {
      actions.push({ id: 'delete', icon: Trash2, label: 'Delete', onClick: onDelete, variant: 'destructive' });
    }
  }

  if (actions.length === 0) return null;

  return (
    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.id}
            onClick={action.onClick}
            title={action.label}
            className={cn(
              'p-1 rounded-lg transition-colors',
              action.variant === 'destructive'
                ? 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        );
      })}
    </div>
  );
}

export function MessageBubble({
  role,
  children,
  timestamp,
  onCopy,
  onEdit,
  onFork,
  onRetry,
  onDelete,
  actions,
  className,
}: MessageBubbleProps) {
  if (role === 'system') {
    return (
      <div className={cn('flex justify-center py-2', className)}>
        <div className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
          {children}
        </div>
      </div>
    );
  }

  const isUser = role === 'user';

  return (
    <div
      className={cn(
        'group max-w-full',
        isUser ? 'flex justify-end' : 'flex gap-2.5 justify-start',
        className
      )}
    >
      {/* Agent avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-muted flex items-center justify-center mt-0.5">
          <Bot className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      <div className={cn('flex flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        {/* Message + actions row */}
        <div className={cn('flex items-end gap-1.5', isUser ? 'flex-row-reverse' : 'flex-row')}>
          {/* Message content — no bubble for user, lighter for agent */}
          <div className={isUser ? 'message-user' : 'message-agent'}>
            <div className="text-[13px] leading-relaxed">{children}</div>
          </div>

          {/* Hover actions */}
          <MessageActions
            role={role}
            onCopy={onCopy}
            onEdit={onEdit}
            onFork={onFork}
            onRetry={onRetry}
            onDelete={onDelete}
            actions={actions}
          />
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span className="text-[10px] text-muted-foreground px-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
