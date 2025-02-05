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
        let timeCompare = 0;
        let priceCompare = 0;
        let ingredientCompare = 0;

        // Sort by time
        if (filter.timeApprox !== 0) {
          timeCompare = compareTag(
            a.timeApproximation,
            b.timeApproximation,
            filter.timeApprox,
            1
          ); // 1 for time tag
        }

        // Sort by price
        if (filter.price !== 0) {
          priceCompare = compareTag(
            a.priceApproximation,
            b.priceApproximation,
            filter.price,
            2
          ); // 2 for price tag
        }

        // Sort by ingredient amount
        if (filter.ingredientAmount !== 0) {
          ingredientCompare = compareTag(
            a.ingredients.length,
            b.ingredients.length,
            filter.ingredientAmount,
            3
          ); // 3 for ingredient tag
        }

        return timeCompare || priceCompare || ingredientCompare;
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
