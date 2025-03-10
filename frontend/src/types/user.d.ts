import { ObjectId } from "mongodb";
import { GroceryList } from "./grocery";
import { SavedRecipeMetaData } from "./saved";

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
  userId: ObjectId; // User ID
  username: string; // Username of the user
  avatarImageId: ObjectId; // Avatar image ID
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
  settings: {
    theme: "light" | "dark"; // The theme of the user (default is light)
  };

  // User profile preferences (will add more later)
  preferences: {
    dietaryRestrictions: string[];
    allergies: string[];
  };

  savedItems: {
    recipes: SavedRecipeMetaData[];
    groceryLists: SavedGroceryMetaData[];
  };

  currentGroceryList: GroceryList | null; // The current grocery list the user is working on
  createdRecipes: ObjectId[]; // The recipes the user created (they are the creator)
  following: FollowMetadata[]; // The users the user is following
  followers: FollowMetadata[]; // The users that are following the user
  lastLogin: Date; // The last time the user logged in (used for analytics and for potential account termination)
  dateJoined: Date; // The date the user joined
};
