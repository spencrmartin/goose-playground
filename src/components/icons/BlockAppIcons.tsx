/**
 * Block App Icons — Square, Cash App, Goose
 *
 * Uses the actual SVG assets from /public/icons/.
 * Each icon renders as an <img> tag with pixelated rendering.
 * The container uses bg-foreground/text-background so the black-bg SVGs
 * automatically invert in light mode (black bg on white) vs dark mode (white bg on black).
 *
 * For dark mode: the SVGs have black backgrounds with white icons — they show as-is.
 * For light mode: we apply CSS filter invert so they become white bg with black icons.
 */

import { cn } from '../../lib/utils';

interface BlockAppIconProps {
  size?: number;
  className?: string;
}

function BlockIcon({ src, size = 20, className }: { src: string } & BlockAppIconProps) {
  const r = size >= 20 ? 5 : size >= 12 ? 3 : 2;
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      className={cn('flex-shrink-0 dark:invert invert-0', className)}
      style={{ borderRadius: r, imageRendering: 'auto' }}
    />
  );
}

/** Square — magnifying glass / location pin on black rounded rect */
export function SquareIcon({ size = 20, className }: BlockAppIconProps) {
  return <BlockIcon src="/icons/square-app.svg" size={size} className={className} />;
}

/** Cash App — white dollar sign on Cash Green (#00D632) rounded rect.
 *  Uses cash-app-green.svg (black bg swapped to #00D632). No invert needed. */
export function CashAppIcon({ size = 20, className }: BlockAppIconProps) {
  const r = size >= 20 ? 5 : size >= 12 ? 3 : 2;
  return (
    <img
      src="/icons/cash-app-green.svg"
      width={size}
      height={size}
      alt=""
      className={cn('flex-shrink-0', className)}
      style={{ borderRadius: r, imageRendering: 'auto' }}
    />
  );
}

/** Goose — goose silhouette on transparent/white */
export function GooseAppIcon({ size = 20, className }: BlockAppIconProps) {
  return <BlockIcon src="/icons/goose-app.svg" size={size} className={className} />;
}

/** Nexus — rainbow diagonal stripes on black rounded rect */
export function NexusIcon({ size = 20, className }: BlockAppIconProps) {
  return <BlockIcon src="/icons/nexus.svg" size={size} className={className} />;
}
