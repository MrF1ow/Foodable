import { ObjectId } from "mongodb";
import { GroceryList } from "./grocery";
import { SavedRecipeMetaData } from "./saved";

export type UserSettings = {
  theme: "light" | "dark";
};

export type UserPreferences = {
  dietaryRestrictions: string[];
  budget: number;
};

export type UserRating = {
  userId: ObjectId; // User ID
  comment: string; // User comment
  rating: number; // User rating
};

export type UserIdentifiers = {
  clerkId: string; // Clerk ID
  username: string; // Username of the user
  email: string; // Email of the user
};

export type User = NewUser & {
  id: ObjectId; // User ID
};

export type FollowMetadata = {
  _id: string; // mongodb id of user
  username: string; // Username of the user
};

// User profile settings (will add more later)
export type SavedRecipeItems = {
  title: string;
  items: SavedRecipeMetaData[];
};

export type SavedGroceryItems = {
  title: string;
  items: SavedGroceryMetaData[];
};

export type NewUser = UserIdentifiers & {
  // User profile settings (will add more later)
  settings: UserSettings;

  // User profile preferences (will add more later)
  preferences: UserPreferences;

  savedItems: {
    recipes: SavedRecipeMetaData[];
    groceryLists: SavedGroceryMetaData[];
  };

  currentGroceryList: ObjectId | null; // The current grocery list the user is working on
  createdRecipes: ObjectId[]; // The recipes the user created (they are the creator)
  following: FollowMetadata[]; // The users the user is following
  followers: FollowMetadata[]; // The users that are following the user
  lastLogin: Date; // The last time the user logged in (used for analytics and for potential account termination)
  dateJoined: Date; // The date the user joined
};
