import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project } from '@/types';

// ============================================
// Project Store — Projects, Active Project
// ============================================

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  loading: boolean;

  // Computed
  activeProject: () => Project | null;

  // Actions
  setProjects: (projects: Project[]) => void;
  setActiveProject: (id: string | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,
      loading: false,

      activeProject: () => {
        const { projects, activeProjectId } = get();
        return projects.find((p) => p.id === activeProjectId) ?? null;
      },

      setProjects: (projects) => set({ projects }),

      setActiveProject: (id) => set({ activeProjectId: id }),

      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p,
          ),
        })),

      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
        })),

      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'goose-projects',
      partialize: (state) => ({
        activeProjectId: state.activeProjectId,
      }),
    },
  ),
);
