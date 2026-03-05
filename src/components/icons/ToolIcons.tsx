/**
 * Tool Icons — Custom 11×11 SVG icons for tool call types.
 * Each icon is a rounded square with a unique colored background
 * and minimal shape inside. Designed to be used at small sizes
 * inline with tool call descriptions.
 *
 * Source: Goose 2.0 design system icon set
 */

interface ToolIconProps {
  className?: string;
  size?: number;
}

const defaultSize = 11;

export function TerminalIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <rect width="11" height="11" rx="2" fill="#1C1C1E"/>
      <path d="M2 3L2 2L6 2L6 3L2 3Z" fill="#19FF4F"/>
    </svg>
  );
}

export function FileEditIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <rect width="11" height="11" rx="2" fill="url(#fe_grad)"/>
      <path d="M8.96875 2.03125L8.96875 4.78125L2.09375 4.78125L2.09375 3.40625C2.09375 2.64686 2.70936 2.03125 3.46875 2.03125L8.96875 2.03125Z" fill="white"/>
      <path d="M5.03125 6.03125L5.03125 9.03125L2.03125 9.03125L2.03125 7.53125C2.03125 6.70282 2.29988 6.03125 2.63125 6.03125L5.03125 6.03125Z" fill="white"/>
      <defs>
        <linearGradient id="fe_grad" x1="5.5" y1="0" x2="5.5" y2="11" gradientUnits="userSpaceOnUse">
          <stop stopColor="#000000"/><stop offset="1" stopColor="#383838"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SearchIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <rect width="11" height="11" rx="2" fill="url(#sr_grad)"/>
      <path d="M7.5625 5.5C7.5625 6.63909 6.63909 7.5625 5.5 7.5625C4.36091 7.5625 3.4375 6.63909 3.4375 5.5C3.4375 4.36091 4.36091 3.4375 5.5 3.4375C6.63909 3.4375 7.5625 4.36091 7.5625 5.5Z" fill="#2D2D2E"/>
      <defs>
        <linearGradient id="sr_grad" x1="5.5" y1="0" x2="5.5" y2="11" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D2D5DA"/><stop offset="1" stopColor="#8B8E95"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Code2Icon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <rect width="11" height="11" rx="2" fill="#1C1C1E"/>
      <rect x="2" y="5" width="7" height="1" rx="0.5" fill="#19FF4F"/>
    </svg>
  );
}

export function ToolIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <rect width="11" height="11" rx="2" fill="#1E1E20"/>
      <rect x="2" y="5" width="7" height="1" rx="0.5" fill="white"/>
    </svg>
  );
}

export function BrainIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <rect width="11" height="11" rx="2" fill="url(#br_grad)"/>
      <path d="M5.5 2.0625L1.375 5.5L5.5 8.9375L9.625 5.5L5.5 2.0625Z" fill="#E74786"/>
      <defs>
        <linearGradient id="br_grad" x1="5.5" y1="0" x2="5.5" y2="11" gradientUnits="userSpaceOnUse">
          <stop stopColor="#000000"/><stop offset="1" stopColor="#323232"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GlobeIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <g clipPath="url(#gl_clip)">
        <rect width="11" height="11" rx="2" fill="white"/>
        <path d="M10.3125 5.5C10.3125 8.15787 8.15787 10.3125 5.5 10.3125C2.84213 10.3125 0.6875 8.15787 0.6875 5.5C0.6875 2.84213 2.84213 0.6875 5.5 0.6875C8.15787 0.6875 10.3125 2.84213 10.3125 5.5Z" fill="url(#gl_grad)"/>
      </g>
      <defs>
        <linearGradient id="gl_grad" x1="5.5" y1="0.6875" x2="5.5" y2="10.3125" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00CAF7"/><stop offset="1" stopColor="#0B54DE"/>
        </linearGradient>
        <clipPath id="gl_clip"><rect width="11" height="11" rx="2" fill="white"/></clipPath>
      </defs>
    </svg>
  );
}

export function EyeIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <rect width="11" height="11" rx="2" fill="url(#ey_grad)"/>
      <path d="M1.375 5.5C1.375 4.36091 2.29841 3.4375 3.4375 3.4375H7.5625C8.70159 3.4375 9.625 4.36091 9.625 5.5V5.5C9.625 6.63909 8.70159 7.5625 7.5625 7.5625H3.4375C2.29841 7.5625 1.375 6.63909 1.375 5.5V5.5Z" fill="white"/>
      <path d="M6.53125 5.5C6.53125 6.06954 6.06954 6.53125 5.5 6.53125C4.93046 6.53125 4.46875 6.06954 4.46875 5.5C4.46875 4.93046 4.93046 4.46875 5.5 4.46875C6.06954 4.46875 6.53125 4.93046 6.53125 5.5Z" fill="black"/>
      <defs>
        <linearGradient id="ey_grad" x1="5.5" y1="0" x2="5.5" y2="11" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00A2FF"/><stop offset="1" stopColor="#5A6DFF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CameraIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <rect width="11" height="11" rx="2" fill="url(#cm_grad)"/>
      <path d="M1.375 3.4375C1.375 3.0578 1.6828 2.75 2.0625 2.75H8.9375C9.3172 2.75 9.625 3.0578 9.625 3.4375V7.5625C9.625 7.9422 9.3172 8.25 8.9375 8.25H2.0625C1.6828 8.25 1.375 7.9422 1.375 7.5625V3.4375Z" fill="#2F2F31"/>
      <path d="M6.53125 5.5C6.53125 6.06954 6.06954 6.53125 5.5 6.53125C4.93046 6.53125 4.46875 6.06954 4.46875 5.5C4.46875 4.93046 4.93046 4.46875 5.5 4.46875C6.06954 4.46875 6.53125 4.93046 6.53125 5.5Z" fill="white"/>
      <defs>
        <linearGradient id="cm_grad" x1="5.5" y1="0" x2="5.5" y2="11" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E2E3F7"/><stop offset="1" stopColor="#978E8F"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function SaveIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <rect width="11" height="11" rx="2" fill="#C32361"/>
      <path d="M5.5 2.0625L1.375 5.5L5.5 8.9375L9.625 5.5L5.5 2.0625Z" fill="#E74786"/>
    </svg>
  );
}

export function FilePlusIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <rect width="11" height="11" rx="2" fill="url(#fp_grad)"/>
      <rect x="2" y="5" width="7" height="1" rx="0.5" fill="white"/>
      <rect x="6" y="2" width="7" height="1" rx="0.5" transform="rotate(90 6 2)" fill="white"/>
      <defs>
        <linearGradient id="fp_grad" x1="5.5" y1="0" x2="5.5" y2="11" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9A00"/><stop offset="1" stopColor="#FFC800"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function FileTextIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <rect width="11" height="11" rx="2" fill="url(#ft_grad)"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M8.73614 2.26386C9.00462 2.53235 9.00462 2.96765 8.73614 3.23614L3.23614 8.73614C2.96765 9.00462 2.53235 9.00462 2.26386 8.73614C1.99538 8.46765 1.99538 8.03235 2.26386 7.76386L7.76386 2.26386C8.03235 1.99538 8.46765 1.99538 8.73614 2.26386Z" fill="white"/>
      <defs>
        <linearGradient id="ft_grad" x1="5.5" y1="0" x2="5.5" y2="11" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB645"/><stop offset="1" stopColor="#FF8735"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MonitorIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <rect width="11" height="11" rx="2" fill="white"/>
      <path d="M9.625 5.5C9.625 7.77817 7.77817 9.625 5.5 9.625C3.22183 9.625 1.375 7.77817 1.375 5.5C1.375 3.22183 3.22183 1.375 5.5 1.375C7.77817 1.375 9.625 3.22183 9.625 5.5Z" fill="#E60023"/>
    </svg>
  );
}

export function HarddriveIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <rect width="11" height="11" rx="2" fill="#1E1E20"/>
      <path d="M5 3.5C5 4.32843 4.32843 5 3.5 5C2.67157 5 2 4.32843 2 3.5C2 2.67157 2.67157 2 3.5 2C4.32843 2 5 2.67157 5 3.5Z" fill="white"/>
    </svg>
  );
}

export function SettingsIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <g clipPath="url(#st_clip)">
        <rect width="11" height="11" rx="2" fill="url(#st_grad)"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M5.5 8.9375C7.39848 8.9375 8.9375 7.39848 8.9375 5.5C8.9375 3.60152 7.39848 2.0625 5.5 2.0625C3.60152 2.0625 2.0625 3.60152 2.0625 5.5C2.0625 7.39848 3.60152 8.9375 5.5 8.9375ZM5.5 10.3125C8.15787 10.3125 10.3125 8.15787 10.3125 5.5C10.3125 2.84213 8.15787 0.6875 5.5 0.6875C2.84213 0.6875 0.6875 2.84213 0.6875 5.5C0.6875 8.15787 2.84213 10.3125 5.5 10.3125Z" fill="#2D2D2E"/>
        <path d="M7.5625 5.5C7.5625 6.63909 6.63909 7.5625 5.5 7.5625C4.36091 7.5625 3.4375 6.63909 3.4375 5.5C3.4375 4.36091 4.36091 3.4375 5.5 3.4375C6.63909 3.4375 7.5625 4.36091 7.5625 5.5Z" fill="#2D2D2E"/>
      </g>
      <defs>
        <linearGradient id="st_grad" x1="5.5" y1="0" x2="5.5" y2="11" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D2D5DA"/><stop offset="1" stopColor="#8B8E95"/>
        </linearGradient>
        <clipPath id="st_clip"><rect width="11" height="11" rx="2" fill="white"/></clipPath>
      </defs>
    </svg>
  );
}

export function NumbersIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <rect width="11" height="11" rx="2" fill="url(#nm_grad)"/>
      <path d="M4.8125 3.4375C4.8125 3.0578 5.1203 2.75 5.5 2.75C5.8797 2.75 6.1875 3.0578 6.1875 3.4375V7.5625C6.1875 7.9422 5.8797 8.25 5.5 8.25C5.1203 8.25 4.8125 7.9422 4.8125 7.5625V3.4375Z" fill="white"/>
      <path d="M2.0625 6.1875C2.0625 5.8078 2.3703 5.5 2.75 5.5C3.1297 5.5 3.4375 5.8078 3.4375 6.1875V7.5625C3.4375 7.9422 3.1297 8.25 2.75 8.25C2.3703 8.25 2.0625 7.9422 2.0625 7.5625V6.1875Z" fill="white"/>
      <path d="M8.25 4.125C7.8703 4.125 7.5625 4.4328 7.5625 4.8125V7.5625C7.5625 7.9422 7.8703 8.25 8.25 8.25C8.6297 8.25 8.9375 7.9422 8.9375 7.5625V4.8125C8.9375 4.4328 8.6297 4.125 8.25 4.125Z" fill="white"/>
      <defs>
        <linearGradient id="nm_grad" x1="5.5" y1="0" x2="5.5" y2="11" gradientUnits="userSpaceOnUse">
          <stop stopColor="#73FA80"/><stop offset="1" stopColor="#00D648"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ArchiveIcon({ className, size = defaultSize }: ToolIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 11 11" fill="none" className={className}>
      <rect width="11" height="11" rx="2" fill="#1E1E20"/>
      <path d="M1.375 6.1875H9.625V8.25C9.625 8.6297 9.3172 8.9375 8.9375 8.9375H2.0625C1.6828 8.9375 1.375 8.6297 1.375 8.25V6.1875Z" fill="#DBD7CE"/>
      <path d="M1.375 6.1875H9.625V7.5625H1.375V6.1875Z" fill="#434343"/>
      <path d="M1.375 4.8125H9.625V6.1875H1.375V4.8125Z" fill="white"/>
      <path d="M1.375 3.4375H9.625V4.8125H1.375V3.4375Z" fill="#616161"/>
      <path d="M1.375 2.75C1.375 2.3703 1.6828 2.0625 2.0625 2.0625H8.9375C9.3172 2.0625 9.625 2.3703 9.625 2.75V3.4375H1.375V2.75Z" fill="#9F9F9F"/>
    </svg>
  );
}

/**
 * Tool icon mapping — maps tool names to their custom SVG icons.
 * Handles both `extension__tool_name` and `extension.tool_name` formats.
 *
 * Tool name → Icon mapping:
 * - shell → TerminalIcon (dark bg, green cursor)
 * - text_editor (write/str_replace) → FileEditIcon (dark bg, document shapes)
 * - text_editor (view) → EyeIcon (blue bg, eye shape)
 * - analyze/search → SearchIcon (grey bg, circle)
 * - code → Code2Icon (dark bg, green line)
 * - web_scrape/read (url) → GlobeIcon (blue gradient globe)
 * - screen_capture → CameraIcon (purple gradient, camera)
 * - create_file → FilePlusIcon (orange gradient, plus)
 * - read/document → FileTextIcon (orange gradient, diagonal)
 * - computer_control → MonitorIcon (white bg, red circle)
 * - remember_memory/retrieve_memories → HarddriveIcon (dark bg, circle)
 * - automation_script → Code2Icon
 * - settings/config → SettingsIcon (grey gradient, rings)
 * - final_output → SaveIcon (red bg, diamond)
 * - default → ToolIcon (dark bg, white line)
 */
type ToolIconComponent = (props: ToolIconProps) => JSX.Element;

const toolIconMap: Record<string, ToolIconComponent> = {
  shell: TerminalIcon,
  text_editor: FileEditIcon,
  analyze: SearchIcon,
  search: SearchIcon,
  find_similar_items: SearchIcon,
  search_knowledge: SearchIcon,
  code: Code2Icon,
  web_scrape: GlobeIcon,
  read: FileTextIcon,
  screen_capture: CameraIcon,
  list_windows: CameraIcon,
  create_file: FilePlusIcon,
  write: FilePlusIcon,
  update_file: FileEditIcon,
  computer_control: MonitorIcon,
  remember_memory: HarddriveIcon,
  retrieve_memories: HarddriveIcon,
  automation_script: Code2Icon,
  final_output: SaveIcon,
  image_processor: CameraIcon,
  create_knowledge_item: FilePlusIcon,
  get_knowledge_context: BrainIcon,
  create_issue: FilePlusIcon,
  search_issues: SearchIcon,
  update_issue: FileEditIcon,
  get_issue: FileTextIcon,
  list_projects: NumbersIcon,
  get_stats: NumbersIcon,
  manage_extensions: SettingsIcon,
  manage_schedule: SettingsIcon,
};

/**
 * Get the appropriate tool icon component for a tool name.
 * Extracts the short tool name from formats like:
 * - `developer__shell`
 * - `developer.text_editor`
 * - `brian__search_knowledge`
 */
export function getToolIcon(toolName: string): ToolIconComponent {
  // Extract short name: after last __ or last .
  let shortName = toolName;
  const doubleUnderscoreIdx = toolName.lastIndexOf('__');
  if (doubleUnderscoreIdx !== -1) {
    shortName = toolName.substring(doubleUnderscoreIdx + 2);
  } else {
    const dotIdx = toolName.lastIndexOf('.');
    if (dotIdx !== -1) {
      shortName = toolName.substring(dotIdx + 1);
    }
  }

  return toolIconMap[shortName] || ToolIcon;
}
