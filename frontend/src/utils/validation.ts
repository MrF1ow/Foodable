// Package Imports
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// Local imports
import { RecipeIngredient, Recipe, NewRecipe } from "@/types/recipe";
import { GroceryItem, GroceryList } from "@/types/grocery";
import { User, UserRating, NewUser } from "@/types/user";
import { unitOptions } from "@/config/unit-conversions";
import { grocerySectionOptions } from "@/config/grocery-sections";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";

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
  return (
    id instanceof ObjectId || // Check if it's already an ObjectId
    (typeof id === "string" && ObjectId.isValid(id) && id.length === 24)
  );
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

export function validateGroceryItem(item: any): item is GroceryItem {
  return (
    item &&
    typeof item.name === "string" &&
    typeof item.quantity === "number" &&
    typeof item.brand === "string"
  );
}

export function validateRecipeIngredient(
  ingredient: any
): ingredient is RecipeIngredient {
  return (
    ingredient &&
    typeof ingredient.name === "string" &&
    typeof ingredient.quantity === "number" &&
    typeof ingredient.unit === "string" &&
    Object.values(unitOptions).includes(ingredient.unit) &&
    typeof ingredient.category === "string" &&
    Object.values(grocerySectionOptions).includes(ingredient.category)
  );
}

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
    Array.isArray(user.savedItems) &&
    Array.isArray(user.createdRecipes) &&
    Array.isArray(user.groceryLists) &&
    Array.isArray(user.following) &&
    Array.isArray(user.followers) &&
    user.savedItems.every(
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

export const validateRecipeWithoutId = (recipe: any): recipe is NewRecipe => {
  return (
    recipe &&
    isValidObjectId(recipe.creatorId) &&
    typeof recipe.title === "string" &&
    typeof recipe.description === "string" &&
    Array.isArray(recipe.ingredients) &&
    Array.isArray(recipe.instructions) &&
    Array.isArray(recipe.userRatings) &&
    recipe.ingredients.every(validateRecipeIngredient) &&
    recipe.instructions.every((instr: any) => typeof instr === "string") &&
    // Check if all user ratings are valid if they exist
    (recipe.userRatings.length === 0 ||
      recipe.userRatings.every(validateUserRating)) &&
    typeof recipe.averageRating === "number" &&
    typeof recipe.priceApproximation === "number" &&
    (recipe.timestamp === undefined ||
      (recipe.timestamp instanceof Date &&
        !isNaN(recipe.timestamp.getTime()))) &&
    (recipe.imageId === undefined || isValidObjectId(recipe.imageId))
  );
};

// Function to check if a recipe is valid
export const validateRecipe = (recipe: any): recipe is Recipe => {
  if (!recipe) return false;

  // Ensure either `id` (string) or `_id` (ObjectId) is present, but not both
  if (recipe.id && typeof recipe.id !== "string") return false;
  if (recipe._id && !(recipe._id instanceof ObjectId)) return false;
  if (recipe.id && recipe._id) return false; // Ensures mutual exclusivity

  // Convert `_id` to `id` for validation consistency
  const recipeCopy = {
    ...recipe,
    id: recipe.id ?? (recipe._id ? recipe._id.toString() : undefined),
  };
  delete recipeCopy._id;

  return validateRecipeWithoutId(recipeCopy);
};

export const validateGroceryListWithoutId = (
  groceryList: any
): groceryList is GroceryList => {
  return (
    groceryList &&
    isValidObjectId(groceryList.creatorId) &&
    typeof groceryList.title === "string" &&
    Array.isArray(groceryList.items) &&
    (groceryList.items.length === 0 ||
      groceryList.items.every(validateGroceryItem)) &&
    (groceryList.timestamp === undefined ||
      (groceryList.timestamp instanceof Date &&
        !isNaN(groceryList.timestamp.getTime())))
  );
};

// Function to check if a grocery list is valid
export const validateGroceryList = (
  groceryList: any
): groceryList is GroceryList => {
  if (!groceryList) {
    return false;
  }

  if (groceryList.id && !isValidObjectId(groceryList.id)) {
    return false;
  }

  if (groceryList._id && !isValidObjectId(groceryList._id)) {
    return false;
  }

  const { _id, id, ...groceryListWithoutId } = groceryList;

  return validateGroceryListWithoutId(groceryListWithoutId);
};
