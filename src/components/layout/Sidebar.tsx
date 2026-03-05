import { useState } from 'react';
import {
  Search,
  Plus,
  MessageSquare,
  MessageSquareText,
  ClipboardList,
  Package,
  Wrench,
  Calendar,
  Zap,
  Settings,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  LayoutGrid,
  List,
  Folder,
  Target,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { DeveloperIcon, BrianIcon, PointAIcon } from '../icons/AppIcons';
import { AppDock } from './AppDock';
import { SquareIcon, CashAppIcon, NexusIcon } from '../icons/BlockAppIcons';

/** Goose silhouette icon — white fill SVG, inverted in light mode */
function GooseIcon({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <img
      src="/icons/goose-logo.svg"
      width={size}
      height={size}
      alt="Goose"
      className={cn('flex-shrink-0 dark:invert-0 invert', className)}
      style={{ imageRendering: 'auto' }}
    />
  );
}

interface SidebarSection {
  title: string;
  action?: React.ReactNode;
  items: SidebarItem[];
  defaultOpen?: boolean;
  /** Allow tile/row toggle for this section */
  viewToggle?: boolean;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ElementType;
  isActive?: boolean;
  badge?: string;
  subtitle?: string;
  /** Session metadata for tile view (matches Goose main branch pattern) */
  workingDir?: string;
  messageCount?: number;
  tokenCount?: number;
  statusDot?: 'connected' | 'disconnected' | 'loading';
  /** Mini project icon shown next to chat items */
  projectIcon?: React.ReactNode;
  onClick?: () => void;
}

export type NavStyle = 'condensed' | 'tiles';
export type NavPosition = 'left' | 'right' | 'top' | 'bottom';

export interface SidebarProps {
  /** Controlled sections — falls back to defaults if omitted */
  sections?: SidebarSection[];
  /** Whether the sidebar is collapsed */
  collapsed?: boolean;
  /** Width in pixels (vertical modes) */
  width?: number;
  /** Height in pixels (horizontal modes) */
  height?: number;
  /** Dock position */
  position?: NavPosition;
  /** Navigation style: condensed rows or airy tiles */
  navStyle?: NavStyle;
  onNavStyleChange?: (style: NavStyle) => void;
  /** Dark mode state for theme toggle */
  isDark?: boolean;
  onToggleTheme?: () => void;
  onCollapse?: () => void;
  onSearch?: () => void;
  className?: string;
}

/** Row view — compact single-line items */
function RowItem({ item }: { item: SidebarItem }) {
  const Icon = item.icon;

  // Build subtitle: prefer explicit subtitle, else compose from metadata
  const subtitleText = item.subtitle
    ? item.messageCount !== undefined
      ? `${item.subtitle} · ${item.messageCount} msgs`
      : item.subtitle
    : undefined;

  return (
    <button
      onClick={item.onClick}
      className={cn(
        'flex items-center gap-2.5 w-full px-3 rounded-md text-[13px]',
        'transition-colors duration-150 py-1.5',
        item.isActive
          ? 'bg-muted text-foreground font-medium'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      )}
    >
      {/* Icon with optional project badge */}
      <span className="relative flex-shrink-0">
        <Icon className="w-4 h-4" />
        {item.projectIcon && (
          <span className="absolute -bottom-0.5 -right-1">{item.projectIcon}</span>
        )}
      </span>
      <div className="flex-1 min-w-0 text-left">
        <span className="block truncate">{item.label}</span>
        {subtitleText && (
          <span className="block text-[10px] text-muted-foreground/70 truncate font-normal">
            {subtitleText}
          </span>
        )}
      </div>
      {item.isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--user-accent))] flex-shrink-0" />
      )}
      {item.statusDot && (
        <span
          className={cn('status-dot flex-shrink-0', {
            connected: item.statusDot === 'connected',
            disconnected: item.statusDot === 'disconnected',
            loading: item.statusDot === 'loading',
          })}
        />
      )}
      {item.badge && (
        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex-shrink-0">
          {item.badge}
        </span>
      )}
    </button>
  );
}

/**
 * Tile view — expanded session card matching Goose main branch SessionListView
 *
 * Shows: title, timestamp (Calendar), working dir (Folder),
 * message count (MessageSquareText), token count (Target)
 */
function TileItem({ item }: { item: SidebarItem }) {
  return (
    <button
      onClick={item.onClick}
      className={cn(
        'flex flex-col w-full py-2.5 px-3 rounded-lg border text-left',
        'transition-all duration-150',
        item.isActive
          ? 'bg-muted border-border text-foreground shadow-sm'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-border hover:shadow-sm'
      )}
    >
      {/* Title */}
      <h3 className={cn('text-[13px] truncate mb-1.5', item.isActive && 'font-medium')}>
        {item.label}
      </h3>

      {/* Timestamp */}
      {item.subtitle && (
        <div className="flex items-center text-[10px] text-muted-foreground/70 mb-1 font-normal">
          <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
          <span>{item.subtitle}</span>
        </div>
      )}

      {/* Working directory */}
      {item.workingDir && (
        <div className="flex items-center text-[10px] text-muted-foreground/70 mb-1.5 font-normal">
          <Folder className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">{item.workingDir}</span>
        </div>
      )}

      {/* Footer: message count + token count */}
      {(item.messageCount !== undefined || item.tokenCount !== undefined) && (
        <div className="flex items-center gap-3 pt-1.5 border-t border-border/50 text-[10px] text-muted-foreground/60 font-normal">
          {item.messageCount !== undefined && (
            <div className="flex items-center">
              <MessageSquareText className="w-3 h-3 mr-1" />
              <span className="font-mono">{item.messageCount}</span>
            </div>
          )}
          {item.tokenCount !== undefined && (
            <div className="flex items-center">
              <Target className="w-3 h-3 mr-1" />
              <span className="font-mono">{item.tokenCount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex-1" />
          {item.isActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--user-accent))] flex-shrink-0" />
          )}
        </div>
      )}
    </button>
  );
}

function SidebarSectionComponent({ section }: { section: SidebarSection }) {
  const [open, setOpen] = useState(section.defaultOpen ?? true);
  const [viewMode, setViewMode] = useState<'rows' | 'tiles'>('rows');

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
      >
        <div className="flex items-center gap-1">
          {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          <span>{section.title}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {/* View toggle — only shown for sections that support it */}
          {section.viewToggle && open && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setViewMode(viewMode === 'rows' ? 'tiles' : 'rows');
              }}
              className="p-0.5 rounded hover:bg-muted transition-colors cursor-pointer"
              title={viewMode === 'rows' ? 'Switch to tile view' : 'Switch to row view'}
            >
              {viewMode === 'rows' ? (
                <LayoutGrid className="w-3 h-3" />
              ) : (
                <List className="w-3 h-3" />
              )}
            </span>
          )}
          {section.action}
        </div>
      </button>

      {open && (
        <div className={cn(
          'animate-fade-in',
          viewMode === 'tiles' && section.viewToggle ? 'space-y-1 px-1.5' : 'space-y-0.5',
        )}>
          {section.items.map((item) =>
            viewMode === 'tiles' && section.viewToggle ? (
              <TileItem key={item.id} item={item} />
            ) : (
              <RowItem key={item.id} item={item} />
            )
          )}
        </div>
      )}
    </div>
  );
}

const defaultSections: SidebarSection[] = [
  {
    title: 'Projects',
    action: (
      <span
        onClick={(e) => e.stopPropagation()}
        className="p-0.5 rounded hover:bg-muted transition-colors cursor-pointer"
      >
        <Plus className="w-3 h-3" />
      </span>
    ),
    items: [
      { id: 'goose2', label: 'Goose 2.0', icon: ({ className }: { className?: string }) => <DeveloperIcon size={className?.includes('w-3') ? 12 : 16} />, isActive: true },
      { id: 'mobile', label: 'Mobile App', icon: ({ className }: { className?: string }) => <BrianIcon size={className?.includes('w-3') ? 12 : 16} /> },
      { id: 'research', label: 'Research', icon: ({ className }: { className?: string }) => <PointAIcon size={className?.includes('w-3') ? 12 : 16} /> },
    ],
  },
  {
    title: 'Recent Chats',
    viewToggle: true,
    action: (
      <span
        onClick={(e) => e.stopPropagation()}
        className="p-0.5 rounded hover:bg-muted transition-colors cursor-pointer"
      >
        <Plus className="w-3 h-3" />
      </span>
    ),
    items: [
      { id: 'chat-1', label: 'Tauri Migration', icon: MessageSquare, isActive: true, subtitle: '2 minutes ago', workingDir: '~/Desktop/goose2.0', messageCount: 24, tokenCount: 18420, projectIcon: <DeveloperIcon size={10} /> },
      { id: 'chat-2', label: 'Design System Setup', icon: MessageSquare, subtitle: '1 hour ago', workingDir: '~/Desktop/goose2.0/ui', messageCount: 18, tokenCount: 12850, projectIcon: <DeveloperIcon size={10} /> },
      { id: 'chat-3', label: 'Fix auth middleware', icon: MessageSquare, subtitle: '3 hours ago', workingDir: '~/projects/api-server', messageCount: 12, tokenCount: 8930, projectIcon: <BrianIcon size={10} /> },
      { id: 'chat-4', label: 'API review for v2', icon: MessageSquare, subtitle: 'Yesterday', workingDir: '~/projects/api-server', messageCount: 31, tokenCount: 24100, projectIcon: <BrianIcon size={10} /> },
      { id: 'chat-5', label: 'Debug CI pipeline', icon: MessageSquare, subtitle: 'Yesterday', workingDir: '~/Desktop/goose2.0', messageCount: 8, tokenCount: 5200, projectIcon: <DeveloperIcon size={10} /> },
      { id: 'chat-6', label: 'Refactor session store', icon: MessageSquare, subtitle: '2 days ago', workingDir: '~/Desktop/goose2.0/ui', messageCount: 15, tokenCount: 11300 },
    ],
  },
  {
    title: 'Quick Access',
    items: [
      { id: 'sessions', label: 'All Sessions', icon: ClipboardList },
      { id: 'apps', label: 'Apps', icon: Package },
      { id: 'extensions', label: 'Extensions', icon: Wrench, badge: '5' },
      { id: 'schedules', label: 'Schedules', icon: Calendar },
      { id: 'recipes', label: 'Recipes', icon: Zap },
    ],
    defaultOpen: false,
  },
];

/**
 * Tiles navigation — airy Metro/Windows Phone style grid of cards.
 * Matches the Goose main branch Hub/SessionInsights pattern.
 */
function TilesNavigation({
  sections,
  onSearch,
  onNavStyleChange,
}: {
  sections: SidebarSection[];
  onSearch?: () => void;
  onNavStyleChange?: (style: NavStyle) => void;
}) {
  // Pull out the chat section for the recent chats tile
  const chatSection = sections.find((s) => s.viewToggle);
  const chatItems = chatSection?.items ?? [];

  // Stats from chat items
  const totalSessions = chatItems.length;
  const totalTokens = chatItems.reduce((sum, item) => sum + (item.tokenCount ?? 0), 0);

  return (
    <div className="flex flex-col h-full gap-0.5 overflow-y-auto bg-background p-0.5">
      {/* Stats row — 2-column grid of big number tiles */}
      <div className="grid grid-cols-2 gap-0.5">
        <div className="bg-card rounded-xl py-4 px-4 flex flex-col justify-end">
          <p className="text-3xl font-mono font-light">{totalSessions}</p>
          <span className="text-[10px] text-muted-foreground">Total sessions</span>
        </div>
        <div className="bg-card rounded-xl py-4 px-4 flex flex-col justify-end">
          <p className="text-3xl font-mono font-light">
            {totalTokens > 0 ? `${(totalTokens / 1000).toFixed(1)}K` : '0'}
          </p>
          <span className="text-[10px] text-muted-foreground">Total tokens</span>
        </div>
      </div>

      {/* Recent chats tile */}
      <div className="bg-card rounded-xl py-4 px-4 flex-1 min-h-0 flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-medium">Recent chats</span>
          <button
            onClick={onSearch}
            className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            See all
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-0.5">
          {chatItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={cn(
                'flex items-center justify-between w-full text-[12px] py-1.5 px-2 rounded-lg transition-colors',
                item.isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              <span className="text-[10px] text-muted-foreground/60 font-mono flex-shrink-0 ml-2">
                {item.subtitle}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick action tiles — 2-column grid */}
      <div className="grid grid-cols-2 gap-0.5">
        {[
          { label: 'New Chat', icon: MessageSquare },
          { label: 'Extensions', icon: Wrench },
          { label: 'Recipes', icon: Zap },
          { label: 'Schedules', icon: Calendar },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className="bg-card rounded-xl py-3 px-3 flex flex-col items-start gap-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Icon className="w-4 h-4" />
              <span className="text-[11px] font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Switch to condensed */}
      {onNavStyleChange && (
        <button
          onClick={() => onNavStyleChange('condensed')}
          className="bg-card rounded-xl py-2 px-4 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <List className="w-3 h-3" />
          <span>Condensed view</span>
        </button>
      )}
    </div>
  );
}

/**
 * Horizontal nav bar — for top/bottom docking.
 * Compact strip: logo, nav icons, recent chats scroll, search, settings.
 */
function HorizontalNavBar({
  sections,
  position,
  height = 48,
  onCollapse,
  onSearch,
  className,
}: {
  sections: SidebarSection[];
  position: 'top' | 'bottom';
  height?: number;
  onCollapse?: () => void;
  onSearch?: () => void;
  className?: string;
}) {
  const chatSection = sections.find((s) => s.viewToggle);
  const chatItems = chatSection?.items ?? [];

  return (
    <div
      className={cn(
        'flex items-center w-full bg-card gap-1 px-3',
        position === 'top' ? 'border-b border-border' : 'border-t border-border',
        className,
      )}
      style={{ height }}
      data-tauri-drag-region
    >
      {/* Logo */}
      <GooseIcon size={18} />

      {/* Divider */}
      <div className="w-px h-5 bg-border mx-1.5 flex-shrink-0" />

      {/* Quick nav icons */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <Button variant="ghost" size="icon-sm" onClick={onSearch} title="Search ⌘K">
          <Search className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" title="New Chat">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-border mx-1.5 flex-shrink-0" />

      {/* Recent chats — horizontal scroll */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto min-w-0 px-1">
        {chatItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs whitespace-nowrap flex-shrink-0 transition-colors',
              item.isActive
                ? 'bg-muted text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <MessageSquare className="w-3 h-3" />
            <span className="max-w-[120px] truncate">{item.label}</span>
            {item.isActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--user-accent))]" />
            )}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-border mx-1.5 flex-shrink-0" />

      {/* App dock — magnetic scaling Block app icons */}
      <div className="flex-shrink-0">
        <AppDock
          items={[
            { id: 'square', name: 'Square', icon: <SquareIcon size={22} /> },
            { id: 'cash', name: 'Cash App', icon: <CashAppIcon size={22} /> },
            { id: 'nexus', name: 'Nexus', icon: <NexusIcon size={22} /> },
          ]}
          baseSize={22}
          hoverSize={34}
        />
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-0.5 flex-shrink-0 ml-1">
        <Button variant="ghost" size="icon-sm" title="Settings">
          <Settings className="w-4 h-4" />
        </Button>
        {onCollapse && (
          <Button variant="ghost" size="icon-sm" onClick={onCollapse} title="Collapse">
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function Sidebar({
  sections,
  collapsed = false,
  width = 240,
  height = 48,
  position = 'left',
  navStyle = 'condensed',
  onNavStyleChange,
  isDark: _isDark = true,
  onToggleTheme: _onToggleTheme,
  onCollapse,
  onSearch,
  className,
}: SidebarProps) {
  const resolvedSections = sections || defaultSections;
  const isHorizontal = position === 'top' || position === 'bottom';

  // Horizontal nav bar — top or bottom
  if (isHorizontal) {
    return (
      <HorizontalNavBar
        sections={resolvedSections}
        position={position}
        height={height}
        onCollapse={onCollapse}
        onSearch={onSearch}
        className={className}
      />
    );
  }

  // Collapsed state — just show icons (vertical only)
  if (collapsed) {
    return (
      <div
        className={cn(
          'flex flex-col items-center h-full w-12 bg-card py-3 gap-1',
          position === 'left' ? 'border-r border-border' : 'border-l border-border',
          className
        )}
      >
        {/* Logo */}
        <GooseIcon size={18} className="mb-1" />

        {/* Expand + Search */}
        <Button variant="ghost" size="icon-sm" onClick={onCollapse} title="Expand sidebar ⌘B">
          <PanelLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={onSearch} title="Search ⌘K">
          <Search className="w-4 h-4" />
        </Button>

        {/* Divider */}
        <div className="w-5 h-px bg-border my-1" />

        {/* Project icons */}
        {resolvedSections
          .find((s) => s.title === 'Projects')
          ?.items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                title={item.label}
                className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150',
                  item.isActive
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}

        {/* Divider */}
        <div className="w-5 h-px bg-border my-1" />

        {/* New chat */}
        <Button variant="ghost" size="icon-sm" title="New chat">
          <Plus className="w-4 h-4" />
        </Button>

        <div className="flex-1" />

        {/* Avatar */}
        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
          <span className="text-[10px] font-medium">SM</span>
        </div>
      </div>
    );
  }

  // Tiles navigation — completely different layout (vertical only)
  if (navStyle === 'tiles') {
    return (
      <div
        className={cn(
          'flex flex-col h-full bg-background',
          position === 'left' ? 'border-r border-border' : 'border-l border-border',
          className,
        )}
        style={{ width }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-3 bg-card" data-tauri-drag-region>
          <div className="flex items-center gap-2">
            <GooseIcon size={18} />
          </div>
          <div className="flex items-center gap-0.5">
            {onCollapse && (
              <Button variant="ghost" size="icon-sm" onClick={onCollapse}>
                <PanelLeftClose className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Tiles content */}
        <TilesNavigation
          sections={resolvedSections}
          onSearch={onSearch}
          onNavStyleChange={onNavStyleChange}
        />

        {/* Footer */}
        <div className="flex items-center px-3 py-2 bg-card border-t border-border">
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
            <span className="text-[10px] font-medium">SM</span>
          </div>
        </div>
      </div>
    );
  }

  // Condensed navigation — compact row-based layout (vertical)
  return (
    <div
      className={cn(
        'flex flex-col h-full bg-card',
        position === 'left' ? 'border-r border-border' : 'border-l border-border',
        className,
      )}
      style={{ width }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-border" data-tauri-drag-region>
        <div className="flex items-center gap-2">
          <GooseIcon size={18} />
        </div>
        <div className="flex items-center gap-0.5">
          {/* Nav style toggle */}
          {onNavStyleChange && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onNavStyleChange('tiles')}
              title="Switch to tiles view"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          )}
          {onCollapse && (
            <Button variant="ghost" size="icon-sm" onClick={onCollapse}>
              <PanelLeftClose className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <button
          onClick={onSearch}
          className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </button>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto py-1">
        {resolvedSections.map((section, i) => (
          <SidebarSectionComponent key={i} section={section} />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center px-3 py-2 border-t border-border">
        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
          <span className="text-[10px] font-medium">SM</span>
        </div>
      </div>
    </div>
  );
}
