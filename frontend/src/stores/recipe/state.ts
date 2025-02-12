import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Recipe } from "@/types/recipe";
import { FilterOptions } from "@/types";
import { GroceryItem } from "@/types/grocery";
import { compareTag } from "@/utils/filterHelpers";
import { RecipeMetaData } from "@/types/saved";
import { metadata } from "@/app/layout";

export type RecipeState = {
  openedRecipe: {
    recipe: Recipe | null;
    metadata: RecipeMetaData | null;
  };
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
  setOpenedRecipe: (recipe: Recipe | null) => void;
  getCurrentMetadata: (id: string) => RecipeMetaData;
  setCurrentRecipes: (recipes: RecipeMetaData[], append?: boolean) => void;
  setCurrentRecipeId: (id: string) => void;
  setFilter: (filter: FilterOptions) => void;
  setFilteredRecipes: (filteredRecipes: RecipeMetaData[]) => void;
  setAdditionalIngredients: (items: GroceryItem[]) => void;
  setCurrentImageUrl: (url: string) => void;

  // Pagination
  loadMoreRecipes: () => Promise<void>;

  // Fetch full recipe details lazily
  fetchFullRecipe: (id: string) => Promise<void>;
};

export const createRecipeActions = (set: any, get: any): RecipeActions => ({
  setOpenedRecipe: (recipe: Recipe | null) => {
    const currentMetadata = recipe
      ? get().currentRecipes.find(
          (recipe: RecipeMetaData) =>
            recipe._id.toString() === recipe._id.toString()
        )
      : null;

    set((state: RecipeState) => ({
      openedRecipe: { recipe, metadata: currentMetadata },
    }));

    setTimeout(() => get().fetchFullRecipe(recipe!._id.toString()), 0);
  },
  getCurrentMetadata: (id: string): RecipeMetaData =>
    get().currentRecipes.find(
      (recipe: RecipeMetaData) => recipe._id.toString() === id
    ),
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
    if (get().fullRecipes[id]) {
      console.log("Recipe already cached");
      const metadata = get().currentRecipes.find(
        (recipe: RecipeMetaData) =>
          recipe._id.toString() === recipe._id.toString()
      );
      set((state: RecipeState) => ({
        openedRecipe: { recipe: state.fullRecipes[id], metadata },
      }));
    }

    try {
      const response = await fetch(`/api/recipes?id=${id}`);
      const recipe = await response.json();

      const metadata = get().currentRecipes.find(
        (recipe: RecipeMetaData) =>
          recipe._id.toString() === recipe._id.toString()
      );

      set((state: RecipeState) => ({
        openedRecipe: {
          recipe: recipe,
          metadata,
        },
        fullRecipes: { ...state.fullRecipes, [id]: recipe },
      }));
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  },
});

export type RecipeStore = RecipeState & RecipeActions;

export const initRecipeStore = (): RecipeState => ({
  openedRecipe: {
    recipe: null,
    metadata: null,
  },
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
  openedRecipe: {
    recipe: null,
    metadata: null,
  },
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
