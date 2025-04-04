import { create } from "zustand";

import { Recipe } from "@/types/recipe";
import { FilterOptions } from "@/types";
import { GroceryItem } from "@/types/grocery";
import { RecipeMetaData, SavedRecipeMetaData } from "@/types/saved";

export type RecipeState = {
  currentRecipe: Recipe | RecipeMetaData | SavedRecipeMetaData | null;
  filter: FilterOptions;
  additionalIngredients: GroceryItem[];
  currentImageUrl: string;
  createForm: boolean;
};

export type RecipeActions = {
  setCurrentRecipe: (
    recipe: Recipe | RecipeMetaData | SavedRecipeMetaData | null
  ) => void;
  setFilter: (filter: FilterOptions) => void;

  setAdditionalIngredients: (items: GroceryItem[]) => void;
  setCurrentImageUrl: (url: string) => void;
  setCreateForm: (createForm: boolean) => void;
};

export const createRecipeActions = (set: any, get: any): RecipeActions => ({
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

  setCurrentImageUrl: (url: string) =>
    set((state: RecipeState) => ({ currentImageUrl: url })),
  setCreateForm: (createForm: boolean) =>
    set((state: RecipeState) => ({ createForm })),
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
  currentImageUrl: "",
  createForm: false,
};

export const createRecipeStore = (initState: RecipeState = defaultInitState) =>
  create<RecipeStore>()((set, get) => ({
    ...initState,
    ...createRecipeActions(set, get),
  }));
