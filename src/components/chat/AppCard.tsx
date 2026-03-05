import React from 'react';
import {
  Brain,
  ClipboardList,
  ExternalLink,
  PanelRight,
  Circle,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

const appIcons: Record<string, React.ElementType> = {
  brian: Brain,
  'point-a': ClipboardList,
};

export type AppStatus = 'connected' | 'disconnected' | 'loading';

export interface AppCardIssue {
  title: string;
  status: string;
  priority: 'urgent' | 'high' | 'medium' | 'low' | 'none';
}

export interface AppCardProps {
  appName: string;
  appId: string;
  subtitle?: string;
  status?: AppStatus;
  issues?: AppCardIssue[];
  onOpenPanel?: () => void;
  onViewAll?: () => void;
  className?: string;
}

const priorityColors: Record<string, string> = {
  urgent: 'text-[hsl(var(--status-error))]',
  high: 'text-[hsl(var(--status-warning))]',
  medium: 'text-[hsl(var(--status-warning)/0.7)]',
  low: 'text-muted-foreground',
  none: 'text-muted-foreground/50',
};

export function AppCard({
  appName,
  appId,
  subtitle,
  status = 'connected',
  issues,
  onOpenPanel,
  onViewAll,
  className,
}: AppCardProps) {
  const Icon = appIcons[appId] || ClipboardList;

  return (
    <div className={cn('app-card animate-fade-in', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{appName}</span>
          {subtitle && (
            <>
              <span className="text-muted-foreground">—</span>
              <span className="text-sm text-muted-foreground">{subtitle}</span>
            </>
          )}
          <span
            className={cn('status-dot', {
              connected: status === 'connected',
              disconnected: status === 'disconnected',
              loading: status === 'loading',
            })}
          />
        </div>
      </div>

      {/* Issues list */}
      {issues && issues.length > 0 && (
        <div className="px-3 py-2 space-y-1.5">
          {issues.map((issue, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Circle
                  className={cn('w-2.5 h-2.5 fill-current', priorityColors[issue.priority])}
                />
                <span className="text-foreground/90 truncate max-w-[240px]">{issue.title}</span>
              </div>
              <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
                {issue.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {(onOpenPanel || onViewAll) && (
        <div className="flex items-center gap-1 px-3 py-2 border-t border-border">
          {onOpenPanel && (
            <Button variant="ghost" size="sm" onClick={onOpenPanel}>
              <PanelRight className="w-3 h-3 mr-1.5" />
              Open in Panel
            </Button>
          )}
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              <ExternalLink className="w-3 h-3 mr-1.5" />
              View All Issues
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
