import { useState, useEffect } from 'react';
import { X, Plus, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AppDock } from './AppDock';
import { SquareIcon, CashAppIcon, NexusIcon } from '../icons/BlockAppIcons';
import PixelBlast from '../ui/PixelBlast';

export type SessionStatus = 'idle' | 'working' | 'complete' | 'error' | 'waiting';

export interface SessionTab {
  id: string;
  title: string;
  isActive?: boolean;
  hasChanges?: boolean;
}

export interface SessionTabsProps {
  tabs?: SessionTab[];
  status?: SessionStatus;
  onSelect?: (id: string) => void;
  onClose?: (id: string) => void;
  onNew?: () => void;
  className?: string;
}

const defaultTabs: SessionTab[] = [
  { id: '1', title: 'New Session', isActive: true },
];

const defaultDockItems = [
  { id: 'square', name: 'Square', icon: <SquareIcon size={24} /> },
  { id: 'cash', name: 'Cash App', icon: <CashAppIcon size={24} /> },
  { id: 'nexus', name: 'Nexus', icon: <NexusIcon size={24} /> },
];

/** Watch for dark/light mode changes on <html> */
function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(el.classList.contains('dark'));
    });
    observer.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

/** Map session status → PixelBlast color + speed.
 *  idle adapts to theme: white in dark mode, black in light mode. */
function useStatusConfig(status: SessionStatus) {
  const isDark = useIsDark();

  const configs: Record<SessionStatus, { color: string; speed: number }> = {
    idle:     { color: isDark ? '#FFFFFF' : '#000000', speed: 0.15 },
    working:  { color: '#3B82F6', speed: 0.35 },
    complete: { color: '#22C55E', speed: 0.10 },
    error:    { color: '#EF4444', speed: 0.15 },
    waiting:  { color: '#EAB308', speed: 0.15 },
  };

  return configs[status];
}

export function SessionTabs({
  tabs,
  status = 'idle',
  onSelect,
  onClose,
  onNew,
  className,
}: SessionTabsProps) {
  const resolvedTabs = tabs || defaultTabs;
  const { color, speed } = useStatusConfig(status);

  return (
    <div
      className={cn(
        'relative flex items-center gap-0.5 px-2 h-10 border-b border-border overflow-hidden',
        className
      )}
      data-tauri-drag-region
    >
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

      {/* Tabs — scrollable, takes available space */}
      <div className="relative z-10 flex items-center gap-0.5 flex-1 overflow-x-auto min-w-0">
        {resolvedTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelect?.(tab.id)}
            className={cn(
              'group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium',
              'transition-colors duration-150 select-none flex-shrink-0 max-w-[180px]',
              tab.isActive
                ? 'bg-muted/80 text-foreground backdrop-blur-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <MessageSquare className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{tab.title}</span>
            {tab.hasChanges && (
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--user-accent))] flex-shrink-0" />
            )}
            {onClose && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(tab.id);
                }}
                className={cn(
                  'ml-0.5 p-0.5 rounded hover:bg-background transition-colors',
                  tab.isActive ? 'opacity-60 hover:opacity-100' : 'opacity-0 group-hover:opacity-60 hover:!opacity-100'
                )}
              >
                <X className="w-3 h-3" />
              </span>
            )}
          </button>
        ))}

        {onNew && (
          <button
            onClick={onNew}
            className="flex items-center justify-center w-7 h-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex-shrink-0"
            title="New session"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Floating app dock — right side of the touch bar */}
      <div className="relative z-10 flex-shrink-0 ml-2">
        <AppDock
          items={defaultDockItems}
          baseSize={24}
          hoverSize={36}
        />
      </div>
    </div>
  );
}
