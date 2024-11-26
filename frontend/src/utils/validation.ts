// Package Imports
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// Local imports
import { Ingredient, UserRating, User, Recipe, GroceryList } from "@/types";
import { HTTP_RESPONSES } from "@/lib/constants";

export const validateObject = <T>(
  obj: any, // this is the object to validate
  validateFn: (obj: any) => obj is T, // this is the function that will validate the object
  errorMessage: string, // this is the error message to return if the object is invalid
  errorStatus: number // this is the status code to return if the object is invalid
): NextResponse | null => {
  // Check if the object exists
  if (!obj) {
    return NextResponse.json(
      { message: errorMessage },
      { status: errorStatus }
    );
  }

  // Validate the object structure
  if (!validateFn(obj)) {
    return NextResponse.json(
      { message: HTTP_RESPONSES.BAD_REQUEST },
      { status: 400 }
    );
  }

  return null; // Return null if validation passes
};

// Function to check if an ID is valid
export const isValidObjectId = (id: any): boolean => {
  return ObjectId.isValid(id);
};

// Function to check if an array is valid and contains only strings
const isValidStringArray = (arr: any): boolean =>
  Array.isArray(arr) && arr.every((item) => typeof item === "string");

// Function to check if the settings are valid
const validateSettings = (settings: any): boolean => {
  return settings && (settings.theme === "light" || settings.theme === "dark");
};

// Function to check if the preferences are valid
const validatePreferences = (preferences: any): boolean => {
  return (
    preferences &&
    isValidStringArray(preferences.dietaryRestrictions) &&
    isValidStringArray(preferences.allergies)
  );
};

// Function to check if an ingredient is valid
export const validateIngredient = (
  ingredient: any
): ingredient is Ingredient => {
  return (
    ingredient &&
    typeof ingredient.name === "string" &&
    typeof ingredient.quantity === "number" &&
    typeof ingredient.brand === "string"
  );
};

// Function to check if a user rating is valid
export const validateUserRating = (rating: any): rating is UserRating => {
  return (
    rating &&
    isValidObjectId(rating.userId) &&
    typeof rating.comment === "string" &&
    typeof rating.rating === "number"
  );
};

// Function to check if a user is valid
export const validateUser = (user: any): user is User => {
  return (
    user &&
    isValidObjectId(user._id) &&
    typeof user.username === "string" &&
    typeof user.email === "string" &&
    validateSettings(user.settings) &&
    validatePreferences(user.preferences) &&
    Array.isArray(user.favoriteRecipes) &&
    user.favoriteRecipes.every(isValidObjectId) &&
    Array.isArray(user.createdRecipes) &&
    user.createdRecipes.every(isValidObjectId) &&
    Array.isArray(user.groceryLists) &&
    user.groceryLists.every(isValidObjectId) &&
    Array.isArray(user.following) &&
    user.following.every(isValidObjectId) &&
    Array.isArray(user.followers) &&
    user.followers.every(isValidObjectId) &&
    user.lastLogin instanceof Date &&
    user.dateJoined instanceof Date
  );
};

// Function to check if a recipe is valid
export const validateRecipe = (recipe: any): recipe is Recipe => {
  return (
    recipe &&
    isValidObjectId(recipe._id) &&
    isValidObjectId(recipe.creatorId) &&
    typeof recipe.title === "string" &&
    typeof recipe.description === "string" &&
    Array.isArray(recipe.ingredients) &&
    recipe.ingredients.every(validateIngredient) &&
    Array.isArray(recipe.instructions) &&
    recipe.instructions.every((instr: any) => typeof instr === "string") &&
    Array.isArray(recipe.userRatings) &&
    recipe.userRatings.every(validateUserRating) &&
    typeof recipe.averageRating === "number" &&
    typeof recipe.priceApproximation === "number" &&
    recipe.timestamp instanceof Date
  );
};

// Function to check if a grocery list is valid
export const validateGroceryList = (
  groceryList: any
): groceryList is GroceryList => {
  return (
    groceryList &&
    isValidObjectId(groceryList._id) &&
    isValidObjectId(groceryList.creatorId) &&
    typeof groceryList.title === "string" &&
    Array.isArray(groceryList.items) &&
    groceryList.items.every(validateIngredient) &&
    groceryList.timestamp instanceof Date
  );
};
