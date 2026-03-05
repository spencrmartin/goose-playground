import { create } from 'zustand';
import type { Extension } from '@/types';

// ============================================
// Extension Store — Installed Extensions & State
// ============================================

interface ExtensionState {
  extensions: Extension[];
  loading: boolean;

  // Per-session overrides
  sessionOverrides: Record<string, string[]>; // sessionId -> enabled extension IDs

  // Actions
  setExtensions: (extensions: Extension[]) => void;
  toggleExtension: (id: string) => void;
  updateExtension: (id: string, updates: Partial<Extension>) => void;
  setSessionOverrides: (sessionId: string, extensionIds: string[]) => void;
  clearSessionOverrides: (sessionId: string) => void;
  getEnabledExtensions: (sessionId?: string) => Extension[];
  setLoading: (loading: boolean) => void;
}

export const useExtensionStore = create<ExtensionState>()((set, get) => ({
  extensions: [],
  loading: false,
  sessionOverrides: {},

  setExtensions: (extensions) => set({ extensions }),

  toggleExtension: (id) =>
    set((state) => ({
      extensions: state.extensions.map((e) =>
        e.id === id ? { ...e, enabled: !e.enabled } : e,
      ),
    })),

  updateExtension: (id, updates) =>
    set((state) => ({
      extensions: state.extensions.map((e) =>
        e.id === id ? { ...e, ...updates } : e,
      ),
    })),

  setSessionOverrides: (sessionId, extensionIds) =>
    set((state) => ({
      sessionOverrides: { ...state.sessionOverrides, [sessionId]: extensionIds },
    })),

  clearSessionOverrides: (sessionId) =>
    set((state) => {
      const { [sessionId]: _, ...rest } = state.sessionOverrides;
      return { sessionOverrides: rest };
    }),

  getEnabledExtensions: (sessionId) => {
    const { extensions, sessionOverrides } = get();
    if (sessionId && sessionOverrides[sessionId]) {
      const overrideIds = sessionOverrides[sessionId];
      return extensions.filter((e) => overrideIds.includes(e.id));
    }
    return extensions.filter((e) => e.enabled);
  },

  setLoading: (loading) => set({ loading }),
}));
