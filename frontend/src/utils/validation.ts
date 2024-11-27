// Package Imports
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// Local imports
import {
  Ingredient,
  UserRating,
  User,
  Recipe,
  GroceryList,
  NewUser,
} from "@/types";
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
  return id !== null && ObjectId.isValid(id);
};

// Function to check if an array is valid and contains only strings
const isValidStringArray = (arr: any): boolean =>
  Array.isArray(arr) &&
  (arr.length === 0 || arr.every((item) => typeof item === "string"));

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

export const validateUserWithoutID = (user: NewUser): user is NewUser => {
  return (
    user &&
    typeof user.username === "string" &&
    typeof user.email === "string" &&
    validateSettings(user.settings) &&
    validatePreferences(user.preferences) &&
    Array.isArray(user.favoriteRecipes) &&
    Array.isArray(user.createdRecipes) &&
    Array.isArray(user.groceryLists) &&
    Array.isArray(user.following) &&
    Array.isArray(user.followers) &&
    user.favoriteRecipes.every(
      (item) => typeof item === "string" || isValidObjectId(item)
    ) &&
    user.createdRecipes.every(
      (item) => typeof item === "string" || isValidObjectId(item)
    ) &&
    user.groceryLists.every(
      (item) => typeof item === "string" || isValidObjectId(item)
    ) &&
    user.following.every(
      (item) => typeof item === "string" || isValidObjectId(item)
    ) &&
    user.followers.every(
      (item) => typeof item === "string" || isValidObjectId(item)
    ) &&
    // Optional lastLogin validation
    (user.lastLogin === undefined ||
      (user.lastLogin instanceof Date && !isNaN(user.lastLogin.getTime()))) &&
    // Optional dateJoined validation
    (user.dateJoined === undefined ||
      (user.dateJoined instanceof Date && !isNaN(user.dateJoined.getTime())))
  );
};

export const validateUser = (user: any): user is User => {
  if (!user) {
    return false;
  }

  // Validate 'id' field if it exists
  if (user.id && !isValidObjectId(user.id)) {
    return false;
  }

  // Validate '_id' field if it exists
  if (user._id && !isValidObjectId(user._id)) {
    return false;
  }

  const { _id, id, ...userWithoutId } = user;

  return validateUserWithoutID(userWithoutId);
};

// Function to check if a recipe is valid
export const validateRecipe = (recipe: any): recipe is Recipe => {
  return (
    recipe &&
    isValidObjectId(recipe.id) &&
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
    isValidObjectId(groceryList.id) &&
    isValidObjectId(groceryList.creatorId) &&
    typeof groceryList.title === "string" &&
    Array.isArray(groceryList.items) &&
    groceryList.items.every(validateIngredient) &&
    groceryList.timestamp instanceof Date
  );
};
