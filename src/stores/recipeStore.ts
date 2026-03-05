import { create } from 'zustand';
import type { Recipe, Schedule } from '@/types';

// ============================================
// Recipe Store — Recipes, Slash Commands, Schedules
// ============================================

interface RecipeState {
  recipes: Recipe[];
  schedules: Schedule[];
  loading: boolean;

  // Computed
  slashCommands: () => Recipe[];

  // Actions
  setRecipes: (recipes: Recipe[]) => void;
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (id: string) => void;
  setSchedules: (schedules: Schedule[]) => void;
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, updates: Partial<Schedule>) => void;
  removeSchedule: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useRecipeStore = create<RecipeState>()((set, get) => ({
  recipes: [],
  schedules: [],
  loading: false,

  slashCommands: () => get().recipes.filter((r) => r.isSlashCommand),

  setRecipes: (recipes) => set({ recipes }),
  addRecipe: (recipe) => set((state) => ({ recipes: [...state.recipes, recipe] })),
  removeRecipe: (id) =>
    set((state) => ({ recipes: state.recipes.filter((r) => r.id !== id) })),

  setSchedules: (schedules) => set({ schedules }),
  addSchedule: (schedule) =>
    set((state) => ({ schedules: [...state.schedules, schedule] })),
  updateSchedule: (id, updates) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id ? { ...s, ...updates } : s,
      ),
    })),
  removeSchedule: (id) =>
    set((state) => ({ schedules: state.schedules.filter((s) => s.id !== id) })),

  setLoading: (loading) => set({ loading }),
}));
