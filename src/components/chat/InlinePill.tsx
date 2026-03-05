/**
 * InlinePill — A rich inline reference that sits within flowing text.
 *
 * Renders as a subtle pill (like a smart chip) that shows a label inline.
 * On hover, a popover card appears with a preview — website screenshot,
 * file contents, issue details, knowledge snippet, etc.
 *
 * Usage in a paragraph:
 *   I checked <InlinePill type="link" label="Square" href="https://square.ca" />
 *   and found the API docs. The issue <InlinePill type="issue" label="GOOSE-42" ... />
 *   tracks this work.
 */

import { useState, useRef } from 'react';
import {
  ExternalLink,
  FileText,
  Hash,
  Brain,
  Globe,
  Code,
  Terminal,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export type PillType = 'link' | 'file' | 'issue' | 'knowledge' | 'code' | 'command';

export type PillSize = 'sm' | 'default';

interface InlinePillProps {
  type: PillType;
  label: string;
  /** Size variant — 'sm' for mini previews (matches ~9px text), 'default' for normal */
  size?: PillSize;
  /** URL for links */
  href?: string;
  /** Subtitle shown in popover */
  subtitle?: string;
  /** Preview image URL or placeholder */
  previewImage?: string;
  /** Text content shown in popover body */
  previewContent?: string;
  /** Extra metadata lines */
  meta?: { label: string; value: string }[];
  className?: string;
}

const pillIcons: Record<PillType, React.ElementType> = {
  link: Globe,
  file: FileText,
  issue: Hash,
  knowledge: Brain,
  code: Code,
  command: Terminal,
};

const pillColors: Record<PillType, string> = {
  link: 'bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-400 border-blue-500/20 dark:border-blue-400/20',
  file: 'bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400 border-amber-500/20 dark:border-amber-400/20',
  issue: 'bg-violet-500/10 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400 border-violet-500/20 dark:border-violet-400/20',
  knowledge: 'bg-pink-500/10 text-pink-600 dark:bg-pink-400/10 dark:text-pink-400 border-pink-500/20 dark:border-pink-400/20',
  code: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-400/20',
  command: 'bg-orange-500/10 text-orange-600 dark:bg-orange-400/10 dark:text-orange-400 border-orange-500/20 dark:border-orange-400/20',
};

export function InlinePill({
  type,
  label,
  size = 'default',
  href,
  subtitle,
  previewImage,
  previewContent,
  meta,
  className,
}: InlinePillProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<'above' | 'below'>('above');
  const pillRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const Icon = pillIcons[type];
  const isSm = size === 'sm';

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    // Determine if popover should go above or below
    if (pillRef.current) {
      const rect = pillRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      setPosition(spaceAbove > 320 ? 'above' : 'below');
    }
    setOpen(true);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 200);
  };

  const hasPopover = previewImage || previewContent || meta || subtitle;

  return (
    <span
      ref={pillRef}
      className={cn('relative inline-flex', className)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* The pill itself — inline within text */}
      <span
        className={cn(
          'inline-flex items-center border font-medium',
          'cursor-default transition-all duration-150',
          'hover:shadow-sm hover:brightness-95 dark:hover:brightness-110',
          isSm
            ? 'gap-0.5 px-1 py-px rounded text-[8px]'
            : 'gap-1 px-1.5 py-0.5 rounded-md text-[12px]',
          pillColors[type],
        )}
      >
        <Icon className={cn('flex-shrink-0', isSm ? 'w-2 h-2' : 'w-3 h-3')} />
        <span>{label}</span>
        {href && <ExternalLink className={cn('opacity-50 flex-shrink-0', isSm ? 'w-1.5 h-1.5' : 'w-2.5 h-2.5')} />}
      </span>

      {/* Popover card */}
      {hasPopover && open && (
        <span
          className={cn(
            'absolute left-1/2 -translate-x-1/2 z-50',
            'w-[280px] rounded-xl border border-border bg-card shadow-xl',
            'animate-fade-in overflow-hidden',
            position === 'above' ? 'bottom-full mb-2' : 'top-full mt-2',
          )}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          {/* Preview image / website screenshot placeholder */}
          {previewImage && (
            <span className="block w-full h-[160px] bg-muted relative overflow-hidden">
              <img
                src={previewImage}
                alt={`${label} preview`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to placeholder on error
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Gradient fade at bottom */}
              <span className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-card to-transparent" />
            </span>
          )}

          {/* Placeholder image when no previewImage is provided but type is link */}
          {!previewImage && type === 'link' && (
            <span className="flex items-center justify-center w-full h-[140px] bg-muted/50 border-b border-border">
              <span className="flex flex-col items-center gap-2 text-muted-foreground/30">
                <Globe className="w-8 h-8" />
                <span className="text-[10px] font-mono">{href || label}</span>
              </span>
            </span>
          )}

          {/* Content area */}
          <span className="block px-3 py-2.5">
            {/* Title + type badge */}
            <span className="flex items-center gap-2 mb-1">
              <Icon className={cn('w-3.5 h-3.5 flex-shrink-0', pillColors[type].split(' ').find(c => c.startsWith('text-')))} />
              <span className="text-[13px] font-semibold text-foreground truncate">{label}</span>
            </span>

            {/* Subtitle / URL */}
            {subtitle && (
              <span className="block text-[11px] text-muted-foreground mb-1.5 truncate">{subtitle}</span>
            )}
            {href && !subtitle && (
              <span className="block text-[11px] text-muted-foreground/60 font-mono mb-1.5 truncate">{href}</span>
            )}

            {/* Preview content */}
            {previewContent && (
              <span className="block text-[11px] text-muted-foreground leading-relaxed line-clamp-3 mb-1.5">
                {previewContent}
              </span>
            )}

            {/* Metadata */}
            {meta && meta.length > 0 && (
              <span className="flex flex-wrap gap-x-3 gap-y-0.5 pt-1.5 border-t border-border/50">
                {meta.map((m) => (
                  <span key={m.label} className="text-[10px]">
                    <span className="text-muted-foreground/60">{m.label}</span>{' '}
                    <span className="text-muted-foreground font-medium">{m.value}</span>
                  </span>
                ))}
              </span>
            )}
          </span>
        </span>
      )}
    </span>
  );
}
