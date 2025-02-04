import { create } from "zustand";

import { RecipeIngredient, Recipe } from "@/types/recipe";

export type RecipeState = {
  currentRecipes: Recipe[]; // The current recipes
  currentRecipeIndex: number; // The index of the current recipe
  additionalIngredients?: RecipeIngredient[];
  currentImageUrl: string;
};

export type RecipeActions = {
  setCurrentRecipes: (currentRecipes: Recipe[]) => void;
  setCurrentRecipeIndex: (currentRecipeIndex: number) => void;
  setAdditionalIngredients: (additionalIngredients: RecipeIngredient[]) => void;
  setCurrentImageUrl: (currentImageUrl: string) => void;
};

export const createRecipeActions = (set: any): RecipeActions => ({
  setCurrentRecipes: (currentRecipes: Recipe[]) =>
    set((state: RecipeState) => ({ ...state, currentRecipes })),

  setCurrentRecipeIndex: (currentRecipeIndex: number) =>
    set((state: RecipeState) => ({ ...state, currentRecipeIndex })),
  setAdditionalIngredients: (additionalIngredients: RecipeIngredient[]) =>
    set((state: RecipeState) => ({ ...state, additionalIngredients })),
  setCurrentImageUrl: (currentImageUrl: string) =>
    set((state: RecipeState) => ({ ...state, currentImageUrl })),
});

export type RecipeStore = RecipeState & RecipeActions;

export const initRecipeStore = (): RecipeState => {
  return {
    currentRecipes: [],
    currentRecipeIndex: 0,
    additionalIngredients: [],
    currentImageUrl: "",
  };
};

export const defaultInitState: RecipeState = {
  currentRecipes: [],
  currentRecipeIndex: 0,
  additionalIngredients: [],
  currentImageUrl: "",
};

export const createRecipeStore = (
  initState: RecipeState = defaultInitState
) => {
  return create<RecipeStore>((set) => ({
    ...initState,
    ...createRecipeActions(set),
  }));
};
