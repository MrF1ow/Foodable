import { ObjectId } from "mongodb";
import { GroceryList, Recipe } from ".";

export type SavedTypes = "recipe" | "groceryList";

export interface RecipeMetaData {
  _id: ObjectId;
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
  _id: null;
  type: "grocery";
  title: string;
}

export type GroceryMetaData = UnsavedGroceryMetaData & { _id: ObjectId };

export type SavedRecipeMetaData = RecipeMetaData & { category: string };

export type SavedGroceryMetaData = GroceryMetaData & { category: string };

export type SavedItem = SavedRecipeMetaData | SavedGroceryMetaData;
