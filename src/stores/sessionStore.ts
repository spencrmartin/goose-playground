import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session } from '@/types';

// ============================================
// Session Store — Sessions, Tabs, Navigation
// ============================================

interface SessionState {
  sessions: Session[];
  activeSessionId: string | null;
  openTabIds: string[];
  loading: boolean;
  sessionCache: Map<string, Session>;

  // Computed
  activeSession: () => Session | null;
  projectSessions: (projectId: string) => Session[];
  openTabs: () => Session[];

  // Actions
  setSessions: (sessions: Session[]) => void;
  setActiveSession: (id: string | null) => void;
  addSession: (session: Session) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  removeSession: (id: string) => void;

  // Tab management
  openTab: (sessionId: string) => void;
  closeTab: (sessionId: string) => void;
  reorderTabs: (tabIds: string[]) => void;

  setLoading: (loading: boolean) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeSessionId: null,
      openTabIds: [],
      loading: false,
      sessionCache: new Map(),

      activeSession: () => {
        const { sessions, activeSessionId } = get();
        return sessions.find((s) => s.id === activeSessionId) ?? null;
      },

      projectSessions: (projectId: string) => {
        return get().sessions.filter((s) => s.projectId === projectId);
      },

      openTabs: () => {
        const { sessions, openTabIds } = get();
        return openTabIds
          .map((id) => sessions.find((s) => s.id === id))
          .filter(Boolean) as Session[];
      },

      setSessions: (sessions) => set({ sessions }),

      setActiveSession: (id) => {
        set({ activeSessionId: id });
        // Auto-open tab if not already open
        if (id && !get().openTabIds.includes(id)) {
          set((state) => ({ openTabIds: [...state.openTabIds, id] }));
        }
      },

      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions],
          openTabIds: [session.id, ...state.openTabIds],
          activeSessionId: session.id,
        })),

      updateSession: (id, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s,
          ),
        })),

      removeSession: (id) =>
        set((state) => {
          const newTabIds = state.openTabIds.filter((t) => t !== id);
          const newActiveId =
            state.activeSessionId === id
              ? newTabIds[0] ?? null
              : state.activeSessionId;
          return {
            sessions: state.sessions.filter((s) => s.id !== id),
            openTabIds: newTabIds,
            activeSessionId: newActiveId,
          };
        }),

      openTab: (sessionId) =>
        set((state) => {
          if (state.openTabIds.includes(sessionId)) {
            return { activeSessionId: sessionId };
          }
          return {
            openTabIds: [...state.openTabIds, sessionId],
            activeSessionId: sessionId,
          };
        }),

      closeTab: (sessionId) =>
        set((state) => {
          const newTabIds = state.openTabIds.filter((t) => t !== sessionId);
          const newActiveId =
            state.activeSessionId === sessionId
              ? newTabIds[newTabIds.length - 1] ?? null
              : state.activeSessionId;
          return { openTabIds: newTabIds, activeSessionId: newActiveId };
        }),

      reorderTabs: (tabIds) => set({ openTabIds: tabIds }),

      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'goose-sessions',
      partialize: (state) => ({
        activeSessionId: state.activeSessionId,
        openTabIds: state.openTabIds,
      }),
    },
  ),
);
