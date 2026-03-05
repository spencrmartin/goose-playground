import { Cpu, Zap, Wifi } from 'lucide-react';
import { useProviderStore } from '@/stores/providerStore';
import { useChatStore } from '@/stores/chatStore';
import { useExtensionStore } from '@/stores/extensionStore';
import { formatTokens } from '@/lib/utils';

/**
 * StatusBar — Bottom status bar showing model, tokens, extensions
 */
export function StatusBar() {
  const activeProvider = useProviderStore((s) => s.activeProvider());
  const activeModel = useProviderStore((s) => s.activeModel());
  const tokenUsage = useChatStore((s) => s.tokenUsage);
  const extensions = useExtensionStore((s) => s.extensions);
  const enabledCount = extensions.filter((e) => e.enabled).length;

  return (
    <div className="flex items-center justify-between h-6 px-3 border-t border-border bg-background text-[10px] text-muted-foreground">
      {/* Left: Model info */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <Cpu size={10} />
          {activeModel?.name ?? activeProvider?.name ?? 'No model selected'}
        </span>
        <span className="flex items-center gap-1">
          <Zap size={10} />
          {formatTokens(tokenUsage.accumulated.input + tokenUsage.accumulated.output)} tokens
        </span>
      </div>

      {/* Right: Extensions */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <Wifi size={10} />
          {enabledCount} extension{enabledCount !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
}
