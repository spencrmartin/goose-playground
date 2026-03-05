import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  Bird,
  MessageSquare,
  FileText,
  Brain,
  ClipboardList,
  Settings,
  Plus,
  Wrench,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  category: string;
  action?: () => void;
}

export interface CommandScreenProps {
  isOpen?: boolean;
  onClose?: () => void;
  items?: CommandItem[];
  className?: string;
}

const defaultItems: CommandItem[] = [
  // Projects
  { id: 'p-goose', label: 'Goose 2.0', description: 'Active project', icon: Bird, category: 'Projects' },
  { id: 'p-mobile', label: 'Mobile App', description: '12 sessions', icon: FileText, category: 'Projects' },
  { id: 'p-research', label: 'Research', description: '5 sessions', icon: Search, category: 'Projects' },
  // Sessions
  { id: 's-tauri', label: 'Tauri Migration', description: '2 hours ago', icon: MessageSquare, category: 'Sessions' },
  { id: 's-design', label: 'Design System', description: '4 hours ago', icon: MessageSquare, category: 'Sessions' },
  { id: 's-api', label: 'API Review', description: 'Yesterday', icon: MessageSquare, category: 'Sessions' },
  // Apps
  { id: 'a-brian', label: 'Brian', description: 'Knowledge base', icon: Brain, category: 'Apps' },
  { id: 'a-pointa', label: 'Point A', description: 'Issue tracker', icon: ClipboardList, category: 'Apps' },
  // Actions
  { id: 'act-new', label: 'New Session', description: 'Start a new conversation', icon: Plus, category: 'Actions' },
  { id: 'act-provider', label: 'Switch Provider', description: 'Change AI model', icon: Wrench, category: 'Actions' },
  { id: 'act-settings', label: 'Open Settings', description: 'Preferences & config', icon: Settings, category: 'Actions' },
];

export function CommandScreen({ isOpen = true, onClose, items, className }: CommandScreenProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const allItems = items || defaultItems;

  const filtered = query
    ? allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  // Group by category
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const flatList = Object.values(grouped).flat();

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, flatList.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (flatList[selectedIndex]) {
            flatList[selectedIndex].action?.();
            handleClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          handleClose();
          break;
      }
    },
    [flatList, selectedIndex, handleClose]
  );

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  if (!isOpen) return null;

  let globalIndex = 0;

  return (
    <div className={cn('fixed inset-0 z-50 flex items-start justify-center pt-[20vh]', className)}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search everything..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2">
          {Object.entries(grouped).length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No results found
            </div>
          )}

          {Object.entries(grouped).map(([category, categoryItems]) => (
            <div key={category}>
              <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {category}
              </div>
              {categoryItems.map((item) => {
                const idx = globalIndex++;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    data-index={idx}
                    onClick={() => {
                      item.action?.();
                      handleClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      'flex items-center gap-3 w-full px-4 py-2 text-left transition-colors duration-75',
                      idx === selectedIndex ? 'bg-muted' : 'hover:bg-muted/50'
                    )}
                  >
                    <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-foreground truncate">{item.label}</div>
                      {item.description && (
                        <div className="text-[11px] text-muted-foreground truncate">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-border text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <ArrowUp className="w-2.5 h-2.5" />
            <ArrowDown className="w-2.5 h-2.5" />
            navigate
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-2.5 h-2.5" />
            select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="font-mono">esc</kbd>
            close
          </span>
        </div>
      </div>
    </div>
  );
}
