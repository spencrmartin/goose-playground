import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// UI Store — Theme, Layout, Shortcuts, Modals
// ============================================

interface UIState {
  // Theme
  theme: {
    mode: 'light' | 'dark' | 'system';
    accentColor: string;
    density: 'compact' | 'comfortable' | 'spacious';
    fontScale: number;
  };

  // Layout
  layout: {
    sidebarPosition: 'left' | 'right' | 'top' | 'bottom' | 'hidden';
    sidebarWidth: number;
    sidebarHeight: number;
    sidebarCollapsed: boolean;
    appPanelOpen: boolean;
    appPanelPosition: 'right' | 'bottom' | 'floating';
    appPanelWidth: number;
    showStatusBar: boolean;
  };

  // Modals & Overlays
  commandScreenOpen: boolean;
  settingsOpen: boolean;
  activeModal: string | null;

  // Actions
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  setAccentColor: (color: string) => void;
  setDensity: (density: 'compact' | 'comfortable' | 'spacious') => void;
  setFontScale: (scale: number) => void;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  setSidebarPosition: (position: 'left' | 'right' | 'top' | 'bottom' | 'hidden') => void;
  toggleAppPanel: () => void;
  setAppPanelWidth: (width: number) => void;
  toggleCommandScreen: () => void;
  toggleSettings: () => void;
  setActiveModal: (modal: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Default theme
      theme: {
        mode: 'dark',
        accentColor: '#6366f1',
        density: 'comfortable',
        fontScale: 1.0,
      },

      // Default layout
      layout: {
        sidebarPosition: 'left',
        sidebarWidth: 240,
        sidebarHeight: 48,
        sidebarCollapsed: false,
        appPanelOpen: false,
        appPanelPosition: 'right',
        appPanelWidth: 400,
        showStatusBar: true,
      },

      // Modals
      commandScreenOpen: false,
      settingsOpen: false,
      activeModal: null,

      // Actions
      setThemeMode: (mode) =>
        set((state) => ({ theme: { ...state.theme, mode } })),

      setAccentColor: (color) =>
        set((state) => ({ theme: { ...state.theme, accentColor: color } })),

      setDensity: (density) =>
        set((state) => ({ theme: { ...state.theme, density } })),

      setFontScale: (scale) =>
        set((state) => ({ theme: { ...state.theme, fontScale: scale } })),

      toggleSidebar: () =>
        set((state) => ({
          layout: {
            ...state.layout,
            sidebarCollapsed: !state.layout.sidebarCollapsed,
          },
        })),

      setSidebarWidth: (width) =>
        set((state) => ({ layout: { ...state.layout, sidebarWidth: width } })),

      setSidebarPosition: (position) =>
        set((state) => ({ layout: { ...state.layout, sidebarPosition: position } })),

      toggleAppPanel: () =>
        set((state) => ({
          layout: { ...state.layout, appPanelOpen: !state.layout.appPanelOpen },
        })),

      setAppPanelWidth: (width) =>
        set((state) => ({ layout: { ...state.layout, appPanelWidth: width } })),

      toggleCommandScreen: () =>
        set((state) => ({ commandScreenOpen: !state.commandScreenOpen })),

      toggleSettings: () =>
        set((state) => ({ settingsOpen: !state.settingsOpen })),

      setActiveModal: (modal) => set({ activeModal: modal }),
    }),
    {
      name: 'goose-ui-config',
      partialize: (state) => ({
        theme: state.theme,
        layout: state.layout,
      }),
    },
  ),
);
