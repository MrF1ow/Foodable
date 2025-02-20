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

export interface UnsavedGroceryMetaData {
  type: "grocery";
  title: string;
}

export type RecipeMetaData = UnsavedRecipeMetaData & { _id: ObjectId };

export type GroceryMetaData = UnsavedGroceryMetaData & { _id: ObjectId | null };

export type SavedRecipeMetaData = RecipeMetaData & { category: string };

export type SavedGroceryMetaData = GroceryMetaData & { category: string };

export type MainMetaData = SavedRecipeMetaData | SavedGroceryMetaData;

export type Metadata = RecipeMetaData | GroceryMetaData | MainMetaData;
