import { ObjectId } from "mongodb";

export type Ingredient = {
  name: string; // Ingredient name
  quantity: number; // Quantity of ingredient
  brand: string; // Brand of ingredient
};

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

  favoriteRecipes: ObjectId[]; // The recipes the user favorited (they can be the creator or not)
  createdRecipes: ObjectId[]; // The recipes the user created (they are the creator)
  groceryLists: ObjectId[]; // The grocery lists the user created
  following: ObjectId[]; // The users the user is following
  followers: ObjectId[]; // The users that are following the user
  lastLogin: Date; // The last time the user logged in (used for analytics and for potential account termination)
  dateJoined: Date; // The date the user joined
};

export type Recipe = {
  id: ObjectId; // The recipe ID
  creatorId: ObjectId; // The user ID of the creator
  title: string; // The title of the recipe
  description: string; // The description of the recipe
  ingredients: Ingredient[]; // The ingredients of the recipe
  instructions: string[]; // The instructions of the recipe
  userRatings: UserRating[]; // The user ratings of the recipe
  averageRating: number; // The average rating of the recipe
  priceApproximation: number; // The price approximation of the recipe
  timestamp: Date; // The timestamp of the recipe
};

export type GroceryList = NewGroceryList & {
  id: ObjectId; // The grocery list ID
};

export type NewGroceryList = {
  creatorId: ObjectId; // The user ID of the creator
  title: string; // The title of the grocery list
  items: Ingredient[]; // The items of the grocery list
  timestamp: Date; // The timestamp of the grocery list
};
