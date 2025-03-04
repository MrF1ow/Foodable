import { User, UserRating, NewUser } from "@/types/user";
import { isValidStringArray } from "@/utils/typeValidation/general";
import { isValidUserId } from "@/utils/typeValidation/general";

// Validate Settings
const validateSettings = (settings: any): boolean => {
  return settings && (settings.theme === "light" || settings.theme === "dark");
};

// Validate Preferences
const validatePreferences = (preferences: any): boolean => {
  return (
    preferences &&
    isValidStringArray(preferences.dietaryRestrictions) &&
    isValidStringArray(preferences.allergies)
  );
};

// Validate UserRating
export const validateUserRating = (
  rating: any,
  validateIdFn: (id: any) => boolean
): rating is UserRating => {
  return (
    rating &&
    validateIdFn(rating.userId) &&
    typeof rating.comment === "string" &&
    typeof rating.rating === "number"
  );
};

// Validate User Without ID
export const validateUserWithoutID = (
  user: NewUser,
  validateIdFn: (id: any) => boolean
): user is NewUser => {
  return (
    (user &&
      typeof user.username === "string" &&
      typeof user.email === "string" &&
      validateSettings(user.settings) &&
      validatePreferences(user.preferences) &&
      Array.isArray(user.savedItems.recipes) &&
      Array.isArray(user.savedItems.groceryLists) &&
      Array.isArray(user.createdRecipes) &&
      Array.isArray(user.following) &&
      Array.isArray(user.followers) &&
      user.savedItems.recipes.every((item) =>
        item && typeof item === "object" && item._id
          ? validateIdFn(item._id)
          : false
      ) &&
      user.savedItems.groceryLists.every((item) =>
        item && typeof item === "object" && item._id
          ? validateIdFn(item._id)
          : false
      ) &&
      user.currentGroceryList === null) ||
    ((user.currentGroceryList &&
    typeof user.currentGroceryList === "object" &&
    user.currentGroceryList._id
      ? validateIdFn(user.currentGroceryList._id)
      : false) &&
      user.createdRecipes.every((item) => validateIdFn(item)) &&
      user.following.every((item) => validateIdFn(item)) &&
      user.followers.every((item) => validateIdFn(item)) &&
      // Optional lastLogin validation
      (user.lastLogin === undefined ||
        (user.lastLogin instanceof Date && !isNaN(user.lastLogin.getTime()))) &&
      // Optional dateJoined validation
      (user.dateJoined === undefined ||
        (user.dateJoined instanceof Date && !isNaN(user.dateJoined.getTime()))))
  );
};

// Validate User with ID
export const validateUser = (
  user: any,
  validateIdFn: (id: any) => boolean
): user is User => {
  if (!user) {
    return false;
  }
  // Validate '_id' field if it exists
  if (user._id && !validateIdFn(user._id)) {
    return false;
  }

  if (user.clerkId && !isValidUserId(user.clerkId)) {
    return false;
  }

  const { _id, ...userWithoutId } = user;

  return validateUserWithoutID(userWithoutId, validateIdFn);
};
