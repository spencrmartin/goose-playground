import { create } from 'zustand';
import type { Artifact, ArtifactType } from '@/types';

// ============================================
// Artifact Store — Created Artifacts & Versioning
// ============================================

interface ArtifactState {
  artifacts: Artifact[];
  loading: boolean;

  // Computed
  projectArtifacts: (projectId: string) => Artifact[];
  sessionArtifacts: (sessionId: string) => Artifact[];
  pinnedArtifacts: (projectId: string) => Artifact[];
  artifactsByType: (type: ArtifactType) => Artifact[];

  // Actions
  setArtifacts: (artifacts: Artifact[]) => void;
  addArtifact: (artifact: Artifact) => void;
  updateArtifact: (id: string, updates: Partial<Artifact>) => void;
  removeArtifact: (id: string) => void;
  togglePin: (id: string) => void;
  getArtifact: (id: string) => Artifact | undefined;
  setLoading: (loading: boolean) => void;
}

export const useArtifactStore = create<ArtifactState>()((set, get) => ({
  artifacts: [],
  loading: false,

  projectArtifacts: (projectId) =>
    get().artifacts.filter((a) => a.projectId === projectId),

  sessionArtifacts: (sessionId) =>
    get().artifacts.filter((a) => a.sessionId === sessionId),

  pinnedArtifacts: (projectId) =>
    get().artifacts.filter((a) => a.projectId === projectId && a.pinned),

  artifactsByType: (type) =>
    get().artifacts.filter((a) => a.type === type),

  setArtifacts: (artifacts) => set({ artifacts }),

  addArtifact: (artifact) =>
    set((state) => ({ artifacts: [...state.artifacts, artifact] })),

  updateArtifact: (id, updates) =>
    set((state) => ({
      artifacts: state.artifacts.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a,
      ),
    })),

  removeArtifact: (id) =>
    set((state) => ({ artifacts: state.artifacts.filter((a) => a.id !== id) })),

  togglePin: (id) =>
    set((state) => ({
      artifacts: state.artifacts.map((a) =>
        a.id === id ? { ...a, pinned: !a.pinned } : a,
      ),
    })),

  getArtifact: (id) => get().artifacts.find((a) => a.id === id),

  setLoading: (loading) => set({ loading }),
}));
