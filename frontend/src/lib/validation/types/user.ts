import { User, UserRating, NewUser, FollowMetadata } from "@/types/user";
import {
  isValidStringArray,
  isValidUserId,
} from "@/lib/validation/types/general";

// Validate Settings
export function validateSettings(settings: any): boolean {
  if (!settings) return false;
  return (
    settings &&
    typeof settings === "object" &&
    typeof settings.theme === "string" &&
    (settings.theme === "light" || settings.theme === "dark")
  );
}

// Validate Preferences
export function validatePreferences(pref: any): boolean {
  if (!pref) return false;
  return (
    pref &&
    pref.dietaryRestrictions &&
    isValidStringArray(pref.dietaryRestrictions) &&
    pref.foodTypePreferences &&
    isValidStringArray(pref.foodTypePreferences) &&
    typeof pref.budget === "number"
  );
}

export const validateUserFollow = (
  follow: any,
  validateIdFn: (id: any) => boolean,
): follow is FollowMetadata =>
  Boolean(
    follow &&
    typeof follow === "object" &&
    validateIdFn(follow._id) &&
    (follow.imageId === null || validateIdFn(follow.imageId)) &&
    typeof follow.username === "string" &&
    follow.username.length > 0 &&
    (!follow.type || follow.type === "follow"),
  );

// Validate UserRating
export const validateUserRating = (
  rating: any,
  validateIdFn: (id: any) => boolean,
): rating is UserRating =>
  Boolean(
    rating &&
    typeof rating === "object" &&
    validateIdFn(rating.userId) &&
    typeof rating.comment === "string" &&
    typeof rating.rating === "number" &&
    rating.rating >= 0 &&
    rating.rating <= 5,
  );

// Validate User Without ID
export const validateUserWithoutID = (
  user: NewUser,
  validateIdFn: (id: any) => boolean,
): user is NewUser => {
  if (!user) return false;
  return (
    user &&
    typeof user.username === "string" &&
    typeof user.email === "string" &&
    validateSettings(user.settings) &&
    validatePreferences(user.preferences) &&
    (user.imageId === undefined ||
      user.imageId === null ||
      validateIdFn(user.imageId)) &&
    Array.isArray(user.savedItems.recipes) &&
    Array.isArray(user.savedItems.groceryLists) &&
    Array.isArray(user.createdRecipes) &&
    Array.isArray(user.following) &&
    Array.isArray(user.followers) &&
    (user.savedItems.recipes.length === 0 ||
      user.savedItems.recipes.every((item) =>
        item && typeof item === "object" && item._id
          ? validateIdFn(item._id)
          : false,
      )) &&
    (user.savedItems.groceryLists.length === 0 ||
      user.savedItems.groceryLists.every((item) =>
        item && typeof item === "object" && item._id
          ? validateIdFn(item._id)
          : false,
      )) &&
    (user.currentGroceryList === null ||
      (user.currentGroceryList !== null &&
        validateIdFn(user.currentGroceryList))) &&
    user.createdRecipes.every((item) => validateIdFn(item)) &&
    user.following.every((item) => validateUserFollow(item, validateIdFn)) &&
    user.followers.every((item) => validateUserFollow(item, validateIdFn)) &&
    // Optional lastLogin validation
    (user.lastLogin === undefined ||
      (user.lastLogin instanceof Date && !isNaN(user.lastLogin.getTime()))) &&
    // Optional dateJoined validation
    (user.dateJoined === undefined ||
      (user.dateJoined instanceof Date && !isNaN(user.dateJoined.getTime())))
  );
};

// Validate User with ID
export const validateUser = (
  user: any,
  validateIdFn: (id: any) => boolean,
): user is User =>
  Boolean(
    user &&
    typeof user === "object" &&
    user._id &&
    validateIdFn(user._id) &&
    (!user.clerkId || isValidUserId(user.clerkId)) &&
    validateUserWithoutID(
      (({ _id, clerkId, ...rest }) => rest)(user),
      validateIdFn,
    ),
  );
