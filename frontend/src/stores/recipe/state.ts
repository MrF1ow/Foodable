import { create } from "zustand";

import { Recipe } from "@/types/recipe";
import { FilterOptions } from "@/types";
import { GroceryItem } from "@/types/grocery";
import { RecipeMetaData, SavedRecipeMetaData } from "@/types/saved";

export type RecipeState = {
  currentRecipe: Recipe | RecipeMetaData | SavedRecipeMetaData | null;
  filter: FilterOptions;
  additionalIngredients: GroceryItem[];
  currentImageUrl: string | null;
};

export type RecipeActions = {
  setCurrentRecipe: (
    recipe: Recipe | RecipeMetaData | SavedRecipeMetaData | null
  ) => void;
  setFilter: (filter: FilterOptions) => void;
  setAdditionalIngredients: (items: GroceryItem[]) => void;
  setCurrentImageUrl: (url: string | null) => void;
};

export const createRecipeActions = (set: any): RecipeActions => ({
  setCurrentRecipe: (recipe) =>
    set((state: RecipeState) => ({
      ...state,
      currentRecipe: recipe,
    })),

  setFilter: (filter: FilterOptions) =>
    set((state: RecipeState) => ({
      ...state,
      filter,
    })),

  setAdditionalIngredients: (items: GroceryItem[]) =>
    set((state: RecipeState) => ({ additionalIngredients: items })),

  setCurrentImageUrl: (url: string | null) =>
    set((state: RecipeState) => ({ currentImageUrl: url })),
});

export type RecipeStore = RecipeState & RecipeActions;

export const defaultInitState: RecipeState = {
  currentRecipe: null,
  filter: {
    searchQuery: "",
    timeApprox: 0,
    price: 0,
    ingredientAmount: 0,
  },

  additionalIngredients: [],
  currentImageUrl: null,
};

export const createRecipeStore = (initState: RecipeState = defaultInitState) =>
  create<RecipeStore>()((set) => ({
    ...initState,
    ...createRecipeActions(set),
  }));
