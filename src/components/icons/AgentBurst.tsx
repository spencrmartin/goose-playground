/**
 * AgentBurst — Starburst/sunburst icon representing the active agent.
 * Used in the status area below the chat input to show the selected model.
 * Uses currentColor so it inherits text color and works in dark/light mode.
 */

interface AgentBurstProps {
  className?: string;
  size?: number;
  color?: string;
}

export function AgentBurst({ className, size = 16, color }: AgentBurstProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 12-ray starburst */}
      <path
        d="M50 4 L55.5 38 L72 8 L60 40 L88 20 L62.5 44 L96 38 L63 49 L96 58 L62.5 53.5 L88 76 L60 57 L72 88 L55.5 59 L50 92 L44.5 59 L28 88 L40 57 L12 76 L37.5 53.5 L4 58 L37 49 L4 38 L37.5 44 L12 20 L40 40 L28 8 L44.5 38 Z"
        fill={color || 'currentColor'}
      />
    </svg>
  );
}
