import { create } from "zustand";

import { Recipe } from "@/types/recipe";
import { FilterOptions } from "@/types";
import { GroceryItem } from "@/types/grocery";
import { compareTag } from "@/utils/filterHelpers";

export type RecipeState = {
  currentRecipes: Recipe[]; // The current recipes
  currentRecipeIndex: number; // The index of the current recipe
  filter: FilterOptions; // The filter options
  filteredRecipes: Recipe[]; // The filtered recipes
  additionalIngredients: GroceryItem[];
  currentImageUrl: string;
};

export type RecipeActions = {
  setCurrentRecipes: (currentRecipes: Recipe[]) => void;
  setCurrentRecipeIndex: (currentRecipeIndex: number) => void;
  setFilter: (filter: FilterOptions) => void;
  setFilteredRecipes: (filteredRecipes: Recipe[]) => void;
  setAdditionalIngredients: (additionalIngredients: GroceryItem[]) => void;
  setCurrentImageUrl: (currentImageUrl: string) => void;
};

export const createRecipeActions = (set: any): RecipeActions => ({
  setCurrentRecipes: (currentRecipes: Recipe[]) =>
    set((state: RecipeState) => ({ ...state, currentRecipes })),
  setCurrentRecipeIndex: (currentRecipeIndex: number) =>
    set((state: RecipeState) => ({ ...state, currentRecipeIndex })),
  setFilter: (filter: FilterOptions) =>
    set((state: RecipeState) => {
      let filteredRecipes = state.currentRecipes;

      // Apply Search Query
      if (filter.searchQuery) {
        filteredRecipes = filteredRecipes.filter((recipe) =>
          recipe.title
            .trim()
            .toLowerCase()
            .includes(filter.searchQuery.trim().toLowerCase())
        );
      }

      // Sort by Tags
      filteredRecipes = filteredRecipes.sort((a, b) => {
        let result = 0;

        // Sort by time
        if (filter.timeApprox !== 0) {
          result = compareTag(a.tags.time, b.tags.time, filter.timeApprox);
        }

        // Sort by price (if time is equal)
        if (result === 0 && filter.price !== 0) {
          result = compareTag(a.tags.price, b.tags.price, filter.price);
        }

        // Sort by ingredient amount (if time and price are equal)
        if (result === 0 && filter.ingredientAmount !== 0) {
          result = compareTag(
            a.tags.ingredient,
            b.tags.ingredient,
            filter.ingredientAmount
          );
        }

        return result;
      });

      return {
        ...state,
        filter,
        filteredRecipes,
      };
    }),
  setFilteredRecipes: (filteredRecipes: Recipe[]) =>
    set((state: RecipeState) => ({ ...state, filteredRecipes })),
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
    filter: {
      searchQuery: "",
      timeApprox: 0,
      price: 0,
      ingredientAmount: 0,
    } as FilterOptions,
    filteredRecipes: [],
    additionalIngredients: [],
    currentImageUrl: "",
  };
};

export const defaultInitState: RecipeState = {
  currentRecipes: [],
  currentRecipeIndex: 0,
  filter: {
    searchQuery: "",
    timeApprox: 0,
    price: 0,
    ingredientAmount: 0,
  } as FilterOptions,
  filteredRecipes: [],
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
