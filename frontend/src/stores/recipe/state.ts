import { create } from "zustand";

import { RecipeIngredient, Recipe } from "@/types/recipe";
import { GroceryItem } from "@/types/grocery";

export type RecipeState = {
  currentRecipes: Recipe[]; // The current recipes
  currentRecipeIndex: number; // The index of the current recipe
  additionalIngredients: GroceryItem[];
  currentImageUrl: string;
};

export type RecipeActions = {
  setCurrentRecipes: (currentRecipes: Recipe[]) => void;
  setCurrentRecipeIndex: (currentRecipeIndex: number) => void;
  setAdditionalIngredients: (additionalIngredients: GroceryItem[]) => void;
  setCurrentImageUrl: (currentImageUrl: string) => void;
};

export const createRecipeActions = (set: any): RecipeActions => ({
  setCurrentRecipes: (currentRecipes: Recipe[]) =>
    set((state: RecipeState) => ({ ...state, currentRecipes })),
  setCurrentRecipeIndex: (currentRecipeIndex: number) =>
    set((state: RecipeState) => ({ ...state, currentRecipeIndex })),
  setAdditionalIngredients: (additionalIngredients: GroceryItem[]) =>
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
