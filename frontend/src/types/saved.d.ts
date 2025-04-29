import { ObjectId } from "mongodb";
import { GroceryList, Recipe } from ".";

export type SavedTypes = "recipe" | "groceryList";

export interface RecipeMetaData {
  _id: ObjectId;
  creatorId: ObjectId;
  type: "recipe";
  title: string;
  imageId: ObjectId | null;
  tags: {
    time: number;
    price: number;
    ingredient: number;
  };
}

export interface GroceryMetaData {
  _id: ObjectId;
  type: "groceryList";
  title: string;
  timestamp?: Date;
}

export type SavedRecipeMetaData = RecipeMetaData & { category: string };

export type SavedGroceryMetaData = GroceryMetaData & { category: string };

export type SavedItem = SavedRecipeMetaData | SavedGroceryMetaData;

export type UnsavedItem = RecipeMetaData | UnsavedGroceryMetaData;
