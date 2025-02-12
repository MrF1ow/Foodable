import { ObjectId } from "mongodb";
import { GroceryList, Recipe } from ".";

export interface SavedCategory {
  title: string;
  items: MainMetaData[];
}

export interface UnsavedRecipeMetaData {
  type: "recipe";
  title: string;
  imageId: string; // Required for recipes
  tags: {
    time: number;
    price: number;
    ingredient: number;
  };
}

export type RecipeMetaData = UnsavedRecipeMetaData & { _id: ObjectId };

export type SavedRecipeMetaData = RecipeMetaData & { category: string };

export interface NewGroceryMetaData {
  type: "grocery";
  title: string;
  category: string;
}

export type GroceryMetaData = NewGroceryMetaData & { _id: ObjectId };

export type MainMetaData = SavedRecipeMetaData| GroceryMetaData;
