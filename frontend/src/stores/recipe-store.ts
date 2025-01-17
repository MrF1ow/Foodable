import { createStore } from "zustand/vanilla";

import { RecipeIngredient } from "@/types";

export type RecipeState = {
  creatorId: string;
  imageId: string;
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string;
  priceApproximation: number;
};

export type RecipeActions = {
  setCreatorId: (creatorId: string) => void;
  setImageId: (imageId: string) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setIngredients: (ingredients: RecipeIngredient[]) => void;
  setInstructions: (instructions: string) => void;
  setPriceApproximation: (priceApproximation: number) => void;
};

export type RecipeStore = RecipeState & RecipeActions;

export const initRecipeStore = (): RecipeState => {
  return {
    creatorId: "",
    imageId: "",
    title: "",
    description: "",
    ingredients: [],
    instructions: "",
    priceApproximation: 0,
  };
};

export const defaultInitState: RecipeState = {
  creatorId: "",
  imageId: "",
  title: "",
  description: "",
  ingredients: [],
  instructions: "",
  priceApproximation: 0,
};

export const createRecipeStore = (
  initState: RecipeState = defaultInitState
) => {
  return createStore<RecipeState>((set) => ({
    ...initState,

    // Define actions as part of the store
    setCreatorId: (creatorId: string) =>
      set((state) => ({ ...state, creatorId })),
    setImageId: (imageId: string) => set((state) => ({ ...state, imageId })),
    setTitle: (title: string) => set((state) => ({ ...state, title })),
    setDescription: (description: string) =>
      set((state) => ({ ...state, description })),
    setIngredients: (ingredients: RecipeIngredient[]) =>
      set((state) => ({ ...state, ingredients })),
    setInstructions: (instructions: string) =>
      set((state) => ({ ...state, instructions })),
    setPriceApproximation: (priceApproximation: number) =>
      set((state) => ({ ...state, priceApproximation })),
  }));
};
