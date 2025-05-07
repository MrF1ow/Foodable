import { ObjectId } from "mongodb";
import { UserPreferences } from "./user";

export type PreferencesForEmbedding = UserPreferences & {
  _id: ObjectId;
};

export type RecipeForEmbedding = {
  _id: ObjectId;
  title: string; // The title of the recipe
  description: string; // The description of the recipe
  ingredients: RecipeIngredient[]; // The ingredients of the recipe
  instructions: string[]; // The instructions of the recipe
  averageRating: number; // The average rating of the recipe
  priceApproximation: number; // The price approximation of the recipe
  timeApproximation: number; // The time approximation of the recipe
}

export type GroceryListForEmbedding = {
  _id: ObjectId;
  title: string;
  items: GroceryItem[];
}