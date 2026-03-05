import { useState, useRef, useEffect } from 'react';
import {
  Paperclip,
  Globe,
  Settings,
  FolderOpen,
  Mic,
  ArrowUp,
  Square,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ChatInputProps {
  onSend?: (message: string) => void;
  onStop?: () => void;
  onCommandOpen?: () => void;
  onAttach?: () => void;
  onAppLauncher?: () => void;
  placeholder?: string;
  disabled?: boolean;
  isStreaming?: boolean;
  modelName?: string;
  tokenCount?: number;
  extensions?: string[];
  className?: string;
}

export function ChatInput({
  onSend,
  onStop,
  onAttach,
  onAppLauncher,
  onCommandOpen,
  placeholder = 'Type your message here...',
  disabled = false,
  isStreaming = false,
  className,
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend?.(value.trim());
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isStreaming) return;
      handleSend();
    }
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onCommandOpen?.();
    }
  };

  const hasText = value.trim().length > 0;

  return (
    <div className={cn('px-4 pb-4 pt-2', className)}>
      <div className="max-w-3xl mx-auto">
        {/* Dark rounded container */}
        <div
          className={cn(
            'rounded-2xl px-5 pt-4 pb-3',
            'bg-[hsl(var(--card))] border border-border',
            'shadow-lg',
          )}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              'w-full resize-none bg-transparent text-[14px] leading-relaxed',
              'placeholder:text-muted-foreground/60',
              'focus:outline-none',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'max-h-[200px] mb-3',
            )}
          />

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between">
            {/* Left icons */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={onAttach}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                title="Attach file"
              >
                <Paperclip className="w-[18px] h-[18px]" />
              </button>
              <button
                onClick={onCommandOpen}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                title="Web search"
              >
                <Globe className="w-[18px] h-[18px]" />
              </button>

              {/* Separator */}
              <div className="w-px h-4 bg-border mx-1" />

              <button
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                title="Settings"
              >
                <Settings className="w-[18px] h-[18px]" />
              </button>
              <button
                onClick={onAppLauncher}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                title="Projects"
              >
                <FolderOpen className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Right — send or mic button */}
            <div>
              {isStreaming ? (
                <button
                  onClick={onStop}
                  className="w-9 h-9 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors flex items-center justify-center"
                  title="Stop generating"
                >
                  <Square className="w-4 h-4" />
                </button>
              ) : hasText ? (
                <button
                  onClick={handleSend}
                  disabled={disabled}
                  className="w-9 h-9 rounded-full bg-foreground text-background hover:opacity-90 transition-all flex items-center justify-center"
                  title="Send message"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              ) : (
                <button
                  className="w-9 h-9 rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors flex items-center justify-center border border-border"
                  title="Voice input"
                >
                  <Mic className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
