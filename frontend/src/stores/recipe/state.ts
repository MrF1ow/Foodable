import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { Recipe } from "@/types/recipe";
import { FilterOptions } from "@/types";
import { GroceryItem } from "@/types/grocery";
import { compareTag } from "@/utils/filterHelpers";
import { RecipeMetaData, SavedRecipeMetaData } from "@/types/saved";

export type RecipeState = {
  currentRecipe: {
    id: string;
    data: Recipe | null;
    metadata: RecipeMetaData | SavedRecipeMetaData | null;
  };
  currentRecipes: (RecipeMetaData | SavedRecipeMetaData)[]; // The current recipes
  fullRecipes: Record<string, Recipe>; // The full recipes stored in cache
  filteredRecipes: (RecipeMetaData | SavedRecipeMetaData)[]; // The filtered recipes

  filter: FilterOptions; // The filter options
  additionalIngredients: GroceryItem[];
  currentImageUrl: string;

  currentPage: number;
  hasMorePages: boolean;
};

export type RecipeActions = {
  setOpenedRecipe: (recipe: Recipe | null) => void;
  getCurrentMetadata: (id: string) => RecipeMetaData | SavedRecipeMetaData;
  setCurrentRecipes: (recipes: RecipeMetaData[], append?: boolean) => void;
  setCurrentRecipeId: (id: string) => void;
  setFilter: (filter: FilterOptions) => void;
  setFilteredRecipes: (
    filteredRecipes: (RecipeMetaData | SavedRecipeMetaData)[]
  ) => void;
  setAdditionalIngredients: (items: GroceryItem[]) => void;
  setCurrentImageUrl: (url: string) => void;
  replaceRecipe: (savedData: SavedRecipeMetaData) => void;

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
  getCurrentMetadata: (id: string): RecipeMetaData | SavedRecipeMetaData =>
    get().currentRecipes.find(
      (recipe: RecipeMetaData) => recipe._id.toString() === id
    ),
  setCurrentRecipes: (recipes: RecipeMetaData[], append = false) =>
    set((state: RecipeState) => ({
      currentRecipes: append ? [...state.currentRecipes, ...recipes] : recipes,
    })),

  setCurrentRecipeId: (id: string) => {
    set((state: RecipeState) => {
      const metadata = get().currentRecipes.find(
        (recipe: RecipeMetaData) => recipe._id.toString() === id
      );
      return {
        ...state,
        currentRecipe: { id: id, metadata: metadata },
      };
    });

    console.log("Current Recipe Info:", get().currentRecipe);
  },

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

  setFilteredRecipes: (recipes: (RecipeMetaData | SavedRecipeMetaData)[]) =>
    set((state: RecipeState) => ({ filteredRecipes: recipes })),

  setAdditionalIngredients: (items: GroceryItem[]) =>
    set((state: RecipeState) => ({ additionalIngredients: items })),

  setCurrentImageUrl: (url: string) =>
    set((state: RecipeState) => ({ currentImageUrl: url })),

  replaceRecipe: (newData: SavedRecipeMetaData | RecipeMetaData): void => {
    set((state: RecipeState) => {
      const updatedRecipes = state.currentRecipes.map((recipe) =>
        recipe._id.toString() === newData._id.toString() ? newData : recipe
      );

      return {
        currentRecipes: updatedRecipes,
        filteredRecipes: updatedRecipes,
        currentRecipe: {
          id: get().currentRecipe.id,
          data: get().currentRecipe.data,
          metadata: newData,
        },
      };
    });
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
    if (get().fullRecipes[id]) {
      const metadata = get().currentRecipes.find(
        (recipe: RecipeMetaData) =>
          recipe._id.toString() === recipe._id.toString()
      );
      set((state: RecipeState) => ({
        currentRecipe: { id: id, data: state.fullRecipes[id], metadata },
      }));
      return;
    }

    try {
      const response = await fetch(`/api/recipes?id=${id}`);
      const recipe = await response.json();

      set((state: RecipeState) => ({
        currentRecipe: {
          ...state.currentRecipe,
          data: recipe,
        },
        fullRecipes: { ...state.fullRecipes, [id]: recipe },
      }));
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  },
});

export type RecipeStore = RecipeState & RecipeActions;

export const defaultInitState: RecipeState = {
  currentRecipe: {
    id: "",
    data: null,
    metadata: null,
  },
  currentRecipes: [],
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

export const createRecipeStore = (initState: RecipeState = defaultInitState) =>
  create<RecipeStore>()(
    persist(
      (set, get) => ({
        ...initState,
        ...createRecipeActions(set, get),
      }),
      {
        name: "recipe-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          fullRecipes: state.fullRecipes,
        }),
        // need to figure out merging and rehydration
      }
    )
  );
