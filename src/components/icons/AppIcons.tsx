/**
 * AppIcons — Pixel art extension icons from the Goose design system.
 *
 * These are the official 24×24 pixel-art SVG icons for each extension/app.
 * Stored in /public/icons/ and rendered as <img> tags for pixel-perfect display.
 *
 * Icons:
 *   - Developer (dark/charcoal)
 *   - Brian (teal/cyan)
 *   - Point A (amber/gold)
 *   - Goose (orange/coral)
 *   - Extensions (dark blue/indigo)
 *   - Apps (green)
 */

interface AppIconProps {
  size?: number;
  className?: string;
}

function PixelIcon({ src, size = 24, className }: { src: string } & AppIconProps) {
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      className={className}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

export function DeveloperIcon({ size = 24, className }: AppIconProps) {
  return <PixelIcon src="/icons/developer.svg" size={size} className={className} />;
}

export function BrianIcon({ size = 24, className }: AppIconProps) {
  return <PixelIcon src="/icons/brian.svg" size={size} className={className} />;
}

export function PointAIcon({ size = 24, className }: AppIconProps) {
  return <PixelIcon src="/icons/pointa.svg" size={size} className={className} />;
}

export function GooseIcon({ size = 24, className }: AppIconProps) {
  return <PixelIcon src="/icons/goose.svg" size={size} className={className} />;
}

export function ExtensionsIcon({ size = 24, className }: AppIconProps) {
  return <PixelIcon src="/icons/extensions.svg" size={size} className={className} />;
}

export function AppsIcon({ size = 24, className }: AppIconProps) {
  return <PixelIcon src="/icons/apps.svg" size={size} className={className} />;
}

/** Get an app icon component by extension name */
export function getAppIcon(name: string): React.FC<AppIconProps> {
  const lower = name.toLowerCase();
  if (lower.includes('developer') || lower.includes('dev')) return DeveloperIcon;
  if (lower.includes('brian') || lower.includes('knowledge')) return BrianIcon;
  if (lower.includes('point') || lower.includes('tracker')) return PointAIcon;
  if (lower.includes('goose') || lower.includes('core')) return GooseIcon;
  if (lower.includes('extension') || lower.includes('plugin')) return ExtensionsIcon;
  if (lower.includes('app') || lower.includes('grid')) return AppsIcon;
  return DeveloperIcon;
}
