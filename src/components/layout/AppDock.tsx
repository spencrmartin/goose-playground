/**
 * AppDock — macOS-style magnetic dock for app icons.
 *
 * Icons scale up as the mouse approaches, with spring physics.
 * Shows tooltip on hover, active dot indicator, and click bounce.
 * Used in the session tabs / header area.
 */

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface DockAppItem {
  id: string;
  name: string;
  icon: React.ReactNode;
}

function DockIcon({
  item,
  mouseX,
  baseSize = 32,
  hoverSize = 48,
}: {
  item: DockAppItem;
  mouseX: any;
  baseSize?: number;
  hoverSize?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const sizeSync = useTransform(distance, [-100, 0, 100], [baseSize, hoverSize, baseSize]);
  const size = useSpring(sizeSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      className="cursor-pointer flex items-center justify-center relative group"
      whileTap={{ scale: 0.9 }}
    >
      {/* Icon container */}
      <motion.div
        className="w-full h-full flex items-center justify-center"
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {item.icon}
      </motion.div>

      {/* Tooltip */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur-sm text-foreground text-[9px] px-1.5 py-0.5 rounded border border-border whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
        {item.name}
      </div>
    </motion.div>
  );
}

export interface AppDockProps {
  items: DockAppItem[];
  baseSize?: number;
  hoverSize?: number;
  className?: string;
}

export function AppDock({ items, baseSize = 32, hoverSize = 48, className }: AppDockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn('flex items-end gap-1', className)}
    >
      {items.map((item) => (
        <DockIcon
          key={item.id}
          item={item}
          mouseX={mouseX}
          baseSize={baseSize}
          hoverSize={hoverSize}
        />
      ))}
    </motion.div>
  );
}
