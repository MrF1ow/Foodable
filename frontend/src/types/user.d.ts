import { ObjectId } from "mongodb";
import { GroceryList, GroceryListMainInfo } from "./grocery";
import { RecipeMainInfo } from "./recipe";

export type UserRating = {
  userId: ObjectId; // User ID
  comment: string; // User comment
  rating: number; // User rating
};

export type User = NewUser & {
  id: ObjectId; // User ID
};

export type NewUser = {
  username: string; // Username of the user
  email: string; // Email of the user

  // User profile settings (will add more later)
  settings: {
    theme: "light" | "dark"; // The theme of the user (default is light)
  };

  // User profile preferences (will add more later)
  preferences: {
    dietaryRestrictions: string[];
    allergies: string[];
  };

  savedItems: {
    recipes: RecipeMainInfo[];
    groceryLists: GroceryListMainInfo[];
  };

  currentGroceryList: GroceryList; // The current grocery list the user is working on
  createdRecipes: ObjectId[]; // The recipes the user created (they are the creator)
  following: ObjectId[]; // The users the user is following
  followers: ObjectId[]; // The users that are following the user
  lastLogin: Date; // The last time the user logged in (used for analytics and for potential account termination)
  dateJoined: Date; // The date the user joined
};
