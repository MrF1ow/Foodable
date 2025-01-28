import { ObjectId } from "mongodb";

export type RecipeIngredient = {
  name: string; // Ingredient name
  quantity: string; // Quantity of ingredient
};

export type Recipe = NewRecipe &
  (
    | { id: string; _id?: never } // If `id` exists, `_id` must not be present
    | { _id: ObjectId; id?: never }
  ); // If `_id` exists, `id` must not be present

export type NewRecipe = {
  creatorId: ObjectId; // The user ID of the creator
  imageId: ObjectId; // The image ID of the recipe
  title: string; // The title of the recipe
  description: string; // The description of the recipe
  ingredients: RecipeIngredient[]; // The ingredients of the recipe
  instructions: string[]; // The instructions of the recipe
  userRatings: UserRating[]; // The user ratings of the recipe
  averageRating: number; // The average rating of the recipe
  priceApproximation: number; // The price approximation of the recipe
  timeApproximation: number; // The time approximation of the recipe
  timestamp: Date; // The timestamp of the recipe
};
