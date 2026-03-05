import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import { SessionTabs } from './SessionTabs';
import { CommandScreen } from './CommandScreen';
import { AppPanel } from '../apps/AppPanel';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

/**
 * AppLayout — Main application shell (floating panel design)
 *
 * The conversation/chat owns the full viewport as the base layer.
 * Sidebar floats on any edge (left/right/top/bottom) as an overlay.
 * App Panel floats on the right.
 */
export function AppLayout() {
  const sidebarCollapsed = useUIStore((s) => s.layout.sidebarCollapsed);
  const sidebarWidth = useUIStore((s) => s.layout.sidebarWidth);
  const sidebarHeight = useUIStore((s) => s.layout.sidebarHeight);
  const sidebarPosition = useUIStore((s) => s.layout.sidebarPosition);
  const appPanelOpen = useUIStore((s) => s.layout.appPanelOpen);
  const appPanelWidth = useUIStore((s) => s.layout.appPanelWidth);
  const showStatusBar = useUIStore((s) => s.layout.showStatusBar);
  const commandScreenOpen = useUIStore((s) => s.commandScreenOpen);
  const toggleCommandScreen = useUIStore((s) => s.toggleCommandScreen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const isHorizontal = sidebarPosition === 'top' || sidebarPosition === 'bottom';

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandScreen();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      if (e.key === 'Escape' && commandScreenOpen) {
        e.preventDefault();
        toggleCommandScreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandScreenOpen, toggleCommandScreen, toggleSidebar]);

  // Position classes for the floating sidebar overlay
  const sidebarPositionClasses = {
    left: 'absolute top-0 left-0 bottom-0',
    right: 'absolute top-0 right-0 bottom-0',
    top: 'absolute top-0 left-0 right-0',
    bottom: 'absolute bottom-0 left-0 right-0',
  };

  const sidebarRoundingClasses = {
    left: !sidebarCollapsed ? 'rounded-r-xl' : '',
    right: !sidebarCollapsed ? 'rounded-l-xl' : '',
    top: 'rounded-b-xl',
    bottom: 'rounded-t-xl',
  };

  return (
    <div className="relative flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Session tabs — full width across the top */}
      <SessionTabs />

      {/* Main content area — conversation owns the full space */}
      <div className="relative flex-1 min-h-0">
        {/* Conversation / main content — full width */}
        <main className="h-full w-full">
          <Outlet />
        </main>

        {/* Floating sidebar — overlays on the configured edge */}
        {sidebarPosition !== 'hidden' && (
          <div
            className={cn(
              sidebarPositionClasses[sidebarPosition],
              'z-10 transition-all duration-200 ease-out',
            )}
          >
            <Sidebar
              collapsed={sidebarCollapsed}
              width={sidebarWidth}
              height={sidebarHeight}
              position={sidebarPosition}
              onCollapse={toggleSidebar}
              onSearch={toggleCommandScreen}
              className={cn(
                isHorizontal ? 'w-full' : 'h-full',
                'shadow-xl',
                sidebarRoundingClasses[sidebarPosition],
              )}
            />
          </div>
        )}

        {/* Floating app panel — overlays on the right */}
        {appPanelOpen && (
          <div
            className={cn(
              'absolute top-0 right-0 bottom-0 z-10',
              'transition-all duration-200 ease-out',
            )}
          >
            <AppPanel
              width={appPanelWidth}
              className="h-full shadow-xl rounded-l-xl"
            />
          </div>
        )}
      </div>

      {/* Status bar — full width across the bottom */}
      {showStatusBar && <StatusBar />}

      {/* Command screen overlay */}
      {commandScreenOpen && <CommandScreen />}
    </div>
  );
}
