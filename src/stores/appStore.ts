import { create } from 'zustand';
import type { EmbeddedAppConfig, AppContext, AppDisplayMode } from '@/types';

// ============================================
// App Store — Embedded Apps & Context Bridge
// ============================================

interface AppState {
  // Registry
  apps: EmbeddedAppConfig[];
  installedApps: () => EmbeddedAppConfig[];
  enabledApps: () => EmbeddedAppConfig[];

  // Active apps (currently loaded in session)
  activeAppIds: string[];
  appContexts: Record<string, AppContext>;

  // Display state
  focusedAppId: string | null;
  appDisplayModes: Record<string, AppDisplayMode>;

  // Actions — Registry
  setApps: (apps: EmbeddedAppConfig[]) => void;
  addApp: (app: EmbeddedAppConfig) => void;
  updateApp: (id: string, updates: Partial<EmbeddedAppConfig>) => void;
  removeApp: (id: string) => void;
  toggleApp: (id: string) => void;

  // Actions — Active Apps
  loadApp: (appId: string) => void;
  unloadApp: (appId: string) => void;
  setAppContext: (appId: string, context: AppContext) => void;
  clearAppContext: (appId: string) => void;

  // Actions — Display
  setFocusedApp: (appId: string | null) => void;
  setAppDisplayMode: (appId: string, mode: AppDisplayMode) => void;

  // Helpers
  getApp: (id: string) => EmbeddedAppConfig | undefined;
  getAppContext: (id: string) => AppContext | undefined;
}

export const useAppStore = create<AppState>()((set, get) => ({
  apps: [
    // Built-in apps
    {
      id: 'brian',
      name: 'Brian',
      icon: '🧠',
      description: 'Knowledge base and graph visualization',
      version: '0.1.6',
      source: {
        type: 'mcp-server',
        mcpConfig: {
          transport: 'stdio',
          command: 'brian-mcp',
          args: [],
        },
      },
      contextBridge: {
        enabled: true,
        refreshInterval: 5000,
        capabilities: ['knowledge-search', 'knowledge-create', 'graph-visualization'],
        contextEndpoint: 'http://localhost:3100/context',
      },
      display: {
        supportedModes: ['panel', 'inline-card', 'floating', 'fullscreen'],
        defaultMode: 'panel',
        minWidth: 360,
        minHeight: 400,
        defaultWidth: 400,
        defaultHeight: 600,
      },
      permissions: {
        fileSystemAccess: true,
        networkAccess: true,
        clipboardAccess: false,
        notificationAccess: false,
      },
      installed: true,
      enabled: true,
    },
    {
      id: 'pointa',
      name: 'Point A',
      icon: '📋',
      description: 'Issue tracking and project management',
      version: '0.1.0',
      source: {
        type: 'mcp-server',
        mcpConfig: {
          transport: 'stdio',
          command: 'pointa-mcp',
          args: [],
        },
      },
      contextBridge: {
        enabled: true,
        refreshInterval: 10000,
        capabilities: ['issue-tracking', 'project-management', 'sprint-planning'],
        contextEndpoint: 'http://localhost:3200/context',
      },
      display: {
        supportedModes: ['panel', 'inline-card', 'floating', 'fullscreen'],
        defaultMode: 'panel',
        minWidth: 360,
        minHeight: 400,
        defaultWidth: 420,
        defaultHeight: 600,
      },
      permissions: {
        fileSystemAccess: false,
        networkAccess: true,
        clipboardAccess: false,
        notificationAccess: true,
      },
      installed: true,
      enabled: true,
    },
  ],
  activeAppIds: [],
  appContexts: {},
  focusedAppId: null,
  appDisplayModes: {},

  installedApps: () => get().apps.filter((a) => a.installed),
  enabledApps: () => get().apps.filter((a) => a.installed && a.enabled),

  setApps: (apps) => set({ apps }),

  addApp: (app) => set((state) => ({ apps: [...state.apps, app] })),

  updateApp: (id, updates) =>
    set((state) => ({
      apps: state.apps.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),

  removeApp: (id) =>
    set((state) => ({
      apps: state.apps.filter((a) => a.id !== id),
      activeAppIds: state.activeAppIds.filter((aid) => aid !== id),
    })),

  toggleApp: (id) =>
    set((state) => ({
      apps: state.apps.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled } : a,
      ),
    })),

  loadApp: (appId) =>
    set((state) => ({
      activeAppIds: state.activeAppIds.includes(appId)
        ? state.activeAppIds
        : [...state.activeAppIds, appId],
    })),

  unloadApp: (appId) =>
    set((state) => ({
      activeAppIds: state.activeAppIds.filter((id) => id !== appId),
      focusedAppId: state.focusedAppId === appId ? null : state.focusedAppId,
    })),

  setAppContext: (appId, context) =>
    set((state) => ({
      appContexts: { ...state.appContexts, [appId]: context },
    })),

  clearAppContext: (appId) =>
    set((state) => {
      const { [appId]: _, ...rest } = state.appContexts;
      return { appContexts: rest };
    }),

  setFocusedApp: (appId) => set({ focusedAppId: appId }),

  setAppDisplayMode: (appId, mode) =>
    set((state) => ({
      appDisplayModes: { ...state.appDisplayModes, [appId]: mode },
    })),

  getApp: (id) => get().apps.find((a) => a.id === id),
  getAppContext: (id) => get().appContexts[id],
}));
