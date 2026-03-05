import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Provider, Model } from '@/types';

// ============================================
// Provider Store — LLM Providers & Models
// ============================================

interface ProviderState {
  providers: Provider[];
  activeProviderId: string | null;
  activeModelId: string | null;
  loading: boolean;

  // Computed
  activeProvider: () => Provider | null;
  activeModel: () => Model | null;
  configuredProviders: () => Provider[];

  // Actions
  setProviders: (providers: Provider[]) => void;
  setActiveProvider: (id: string) => void;
  setActiveModel: (id: string) => void;
  updateProvider: (id: string, updates: Partial<Provider>) => void;
  setLoading: (loading: boolean) => void;
}

export const useProviderStore = create<ProviderState>()(
  persist(
    (set, get) => ({
      providers: [],
      activeProviderId: null,
      activeModelId: null,
      loading: false,

      activeProvider: () => {
        const { providers, activeProviderId } = get();
        return providers.find((p) => p.id === activeProviderId) ?? null;
      },

      activeModel: () => {
        const { providers, activeModelId } = get();
        for (const provider of providers) {
          const model = provider.models.find((m) => m.id === activeModelId);
          if (model) return model;
        }
        return null;
      },

      configuredProviders: () => get().providers.filter((p) => p.configured),

      setProviders: (providers) => set({ providers }),
      setActiveProvider: (id) => set({ activeProviderId: id }),
      setActiveModel: (id) => set({ activeModelId: id }),

      updateProvider: (id, updates) =>
        set((state) => ({
          providers: state.providers.map((p) =>
            p.id === id ? { ...p, ...updates } : p,
          ),
        })),

      setLoading: (loading) => set({ loading }),
    }),
    {
      name: 'goose-providers',
      partialize: (state) => ({
        activeProviderId: state.activeProviderId,
        activeModelId: state.activeModelId,
      }),
    },
  ),
);
