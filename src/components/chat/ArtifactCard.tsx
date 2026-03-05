import React, { useState } from 'react';
import {
  FolderTree,
  Code2,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

const artifactIcons: Record<string, React.ElementType> = {
  'file-tree': FolderTree,
  code: Code2,
  document: FileText,
};

export interface ArtifactCardProps {
  title: string;
  type?: 'file-tree' | 'code' | 'document';
  content: string;
  language?: string;
  actions?: Array<{ label: string; onClick: () => void }>;
  defaultExpanded?: boolean;
  className?: string;
}

export function ArtifactCard({
  title,
  type = 'document',
  content,
  language,
  actions,
  defaultExpanded = true,
  className,
}: ArtifactCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);
  const Icon = artifactIcons[type] || FileText;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('app-card animate-fade-in', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
        >
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span>{title}</span>
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={handleCopy} title="Copy">
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[hsl(var(--status-success))]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
          {actions?.map((action, i) => (
            <Button key={i} variant="ghost" size="sm" onClick={action.onClick}>
              <ExternalLink className="w-3 h-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div className="animate-fade-in">
          {language && (
            <div className="px-3 pt-2">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {language}
              </span>
            </div>
          )}
          <pre className="p-3 text-xs font-mono leading-relaxed text-foreground/80 overflow-x-auto whitespace-pre">
            {content}
          </pre>
        </div>
      )}
    </div>
  );
}
