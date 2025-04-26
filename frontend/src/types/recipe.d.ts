import { ObjectId } from "mongodb";
import { GrocerySectionOptions } from "./grocery";

export type Recipe = NewRecipe & { _id: ObjectId };

export type RecipeIngredient = {
  name: string;
  quantity: number;
  unit: Units;
  category: GrocerySectionOptions;
};

export type NewRecipe = {
  _id: null;
  creatorId: ObjectId; // The user ID of the creator
  imageId: ObjectId | null; // The image ID of the recipe
  title: string; // The title of the recipe
  description: string; // The description of the recipe
  ingredients: RecipeIngredient[]; // The ingredients of the recipe
  instructions: string[]; // The instructions of the recipe
  userRatings: UserRating[]; // The user ratings of the recipe
  averageRating: number; // The average rating of the recipe
  priceApproximation: number; // The price approximation of the recipe
  timeApproximation: number; // The time approximation of the recipe
  timestamp: Date; // The timestamp of the recipe
  tags: FilterTags; // The tags of the recipe for filtering purposes
};
