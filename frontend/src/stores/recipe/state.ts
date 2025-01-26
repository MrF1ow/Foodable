import { create } from "zustand";
import { ObjectId } from "mongodb";

import { RecipeIngredient } from "@/types/recipe";

export type RecipeState = {
  recipeId?: ObjectId; // Optional since it may not be initialized immediately
  creatorId: ObjectId | string; // String initially, ObjectId after conversion
  imageId: string;
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: string;
  priceApproximation: number;
  timeApproximation: number;
};

export type RecipeActions = {
  setRecipeId: (recipeId: string) => void;
  setCreatorId: (creatorId: string) => void;
  setTitle: (title: string) => void;
  setImageId: (imageId: string) => void;
  setDescription: (description: string) => void;
  setIngredients: (ingredients: RecipeIngredient[]) => void;
  setInstructions: (instructions: string) => void;
  setPriceApproximation: (priceApproximation: number) => void;
  setTimeApproximation: (timeApproximation: number) => void;
};

export const createRecipeActions = (set: any): RecipeActions => ({
  setRecipeId: (recipeId: string) => {
    const id = new ObjectId(recipeId);
    set((state: RecipeState) => ({ ...state, recipeId: id }));
  },
  setCreatorId: (creatorId: string) => {
    const id = new ObjectId(creatorId);
    set((state: RecipeState) => ({ ...state, creatorId: id }));
  },
  setTitle: (title: string) =>
    set((state: RecipeState) => ({ ...state, title })),
  setImageId: (imageId: string) =>
    set((state: RecipeState) => ({ ...state, imageId })),
  setDescription: (description: string) =>
    set((state: RecipeState) => ({ ...state, description })),
  setIngredients: (ingredients: RecipeIngredient[]) =>
    set((state: RecipeState) => ({ ...state, ingredients })),
  setInstructions: (instructions: string) =>
    set((state: RecipeState) => ({ ...state, instructions })),
  setPriceApproximation: (priceApproximation: number) =>
    set((state: RecipeState) => ({ ...state, priceApproximation })),
  setTimeApproximation: (timeApproximation: number) =>
    set((state: RecipeState) => ({ ...state, timeApproximation })),
});

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
    timeApproximation: 0,
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
  timeApproximation: 0,
};

export const createRecipeStore = (
  initState: RecipeState = defaultInitState
) => {
  return create<RecipeStore>((set) => ({
    ...initState,
    ...createRecipeActions(set),
  }));
};
