import { create } from "zustand";

import { Recipe } from "@/types/recipe";
import { FilterOptions } from "@/types";
import { GroceryItem } from "@/types/grocery";
import { compareTag } from "@/utils/filterHelpers";
import { RecipeMetaData } from "@/types/saved";

export type RecipeState = {
  currentRecipes: RecipeMetaData[]; // The current recipes
  fullRecipes: Record<string, Recipe>; // The full recipes stored in cache
  filteredRecipes: RecipeMetaData[]; // The filtered recipes

  currentRecipeId: string;
  filter: FilterOptions; // The filter options
  additionalIngredients: GroceryItem[];
  currentImageUrl: string;

  currentPage: number;
  hasMorePages: boolean;
};

export type RecipeActions = {
  setCurrentRecipes: (recipes: RecipeMetaData[], append?: boolean) => void;
  setCurrentRecipeId: (id: string) => void;
  setFilter: (filter: FilterOptions) => void;
  setFilteredRecipes: (filteredRecipes: RecipeMetaData[]) => void;
  setAdditionalIngredients: (items: GroceryItem[]) => void;
  setCurrentImageUrl: (url: string) => void;
  fetchAndStoreRecipe: (recipeId: string) => Promise<void>;

  // Pagination
  loadMoreRecipes: () => Promise<void>;

  // Fetch full recipe details lazily
  fetchFullRecipe: (id: string) => Promise<void>;
};

export const createRecipeActions = (set: any, get: any): RecipeActions => ({
  setCurrentRecipes: (recipes: RecipeMetaData[], append = false) =>
    set((state: RecipeState) => ({
      currentRecipes: append ? [...state.currentRecipes, ...recipes] : recipes,
    })),

  setCurrentRecipeId: (id: string) =>
    set((state: RecipeState) => ({ currentRecipeIndex: id })),

  setFilter: (filter: FilterOptions) =>
    set((state: RecipeState) => {
      let filteredRecipes = state.currentRecipes;

      if (filter.searchQuery) {
        filteredRecipes = filteredRecipes.filter((recipe) =>
          recipe.title.toLowerCase().includes(filter.searchQuery.toLowerCase())
        );
      }

      filteredRecipes = filteredRecipes.sort((a, b) => {
        let result = 0;
        if (filter.timeApprox !== 0) {
          result = compareTag(a.tags.time, b.tags.time, filter.timeApprox);
        }
        if (result === 0 && filter.price !== 0) {
          result = compareTag(a.tags.price, b.tags.price, filter.price);
        }
        if (result === 0 && filter.ingredientAmount !== 0) {
          result = compareTag(
            a.tags.ingredient,
            b.tags.ingredient,
            filter.ingredientAmount
          );
        }
        return result;
      });

      return { ...state, filter, filteredRecipes };
    }),

  setFilteredRecipes: (recipes: RecipeMetaData[]) =>
    set((state: RecipeState) => ({ filteredRecipes: recipes })),

  setAdditionalIngredients: (items: GroceryItem[]) =>
    set((state: RecipeState) => ({ additionalIngredients: items })),

  setCurrentImageUrl: (url: string) =>
    set((state: RecipeState) => ({ currentImageUrl: url })),

  fetchAndStoreRecipe: async (recipeId: string) => {
    const state = get();

    if (state.fullRecipes[recipeId]) return; // Avoids refetching

    try {
      const response = await fetch(`/api/recipes?id=${recipeId}`);
      if (!response.ok) throw new Error("Failed to fetch recipe");

      const recipe: Recipe = await response.json();

      set((state: RecipeState) => ({
        ...state,
        fullRecipes: {
          ...state.fullRecipes,
          [recipeId]: recipe,
        },
      }));
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  },

  loadMoreRecipes: async () => {
    const { currentPage, currentRecipes } = get();
    const nextPage = currentPage + 1;

    const response = await fetch(`/api/recipes?page=${nextPage}`);
    const data = await response.json();

    set((state: RecipeState) => ({
      currentRecipes: [...state.currentRecipes, ...data.recipes],
      currentPage: nextPage,
      hasMorePages: data.hasMore, // API should return this flag
    }));
  },

  fetchFullRecipe: async (id: string) => {
    if (get().fullRecipes[id]) return; // Avoids refetching

    try {
      const response = await fetch(`/api/recipes?id=${id}`);
      const recipe = await response.json();

      console.log("Fetched recipe:", recipe);

      set((state: RecipeState) => ({
        fullRecipes: { ...state.fullRecipes, [id]: recipe },
      }));
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  },
});

export type RecipeStore = RecipeState & RecipeActions;

export const initRecipeStore = (): RecipeState => ({
  currentRecipes: [],
  currentRecipeId: "",
  fullRecipes: {},
  filter: {
    searchQuery: "",
    timeApprox: 0,
    price: 0,
    ingredientAmount: 0,
  },
  filteredRecipes: [],
  additionalIngredients: [],
  currentImageUrl: "",

  // Pagination
  currentPage: 1,
  hasMorePages: true,
});

export const defaultInitState: RecipeState = {
  currentRecipes: [],
  currentRecipeId: "",
  fullRecipes: {},
  filter: {
    searchQuery: "",
    timeApprox: 0,
    price: 0,
    ingredientAmount: 0,
  },
  filteredRecipes: [],
  additionalIngredients: [],
  currentImageUrl: "",

  // Pagination
  currentPage: 1,
  hasMorePages: true,
};

export const createRecipeStore = (
  initState: RecipeState = defaultInitState
) => {
  return create<RecipeStore>((set, get) => ({
    ...initState,
    ...createRecipeActions(set, get),
  }));
};
