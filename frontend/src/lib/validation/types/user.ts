import { User, UserRating, NewUser, FollowMetadata } from "@/types/user";
import { isValidStringArray, isValidUserId } from "@/lib/validation/types/general";

// Validate Settings
export const validateSettings = (settings: any): boolean => {
  return settings && (settings.theme === "light" || settings.theme === "dark");
};

// Validate Preferences
export const validatePreferences = (preferences: any): boolean => {
  return (
    preferences &&
    isValidStringArray(preferences.dietaryRestrictions) &&
    isValidStringArray(preferences.foodTypePreferences) &&
    typeof preferences.budget === "number"    
  );
};

export const validateUserFollow = (
  follow: any,
  validateIdFn: (id: any) => boolean
): follow is FollowMetadata => {
  return (
    follow &&
    validateIdFn(follow._id) &&
    (validateIdFn(follow.imageId) || follow.imageId === null) &&
    typeof follow.username === "string"
  )
}

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
    user &&
    typeof user.username === "string" &&
    typeof user.email === "string" &&
    validateSettings(user.settings) &&
    (user.imageId === undefined || user.imageId === null || validateIdFn(user.imageId)) &&
    validatePreferences(user.preferences) &&
    Array.isArray(user.savedItems.recipes) &&
    Array.isArray(user.savedItems.groceryLists) &&
    Array.isArray(user.createdRecipes) &&
    Array.isArray(user.following) &&
    Array.isArray(user.followers) &&
    (user.savedItems.recipes.length === 0 ||
      user.savedItems.recipes.every((item) =>
        item && typeof item === "object" && item._id
          ? validateIdFn(item._id)
          : false
      )) &&
    (user.savedItems.groceryLists.length === 0 ||
      user.savedItems.groceryLists.every((item) =>
        item && typeof item === "object" && item._id
          ? validateIdFn(item._id)
          : false
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
  validateIdFn: (id: any) => boolean
): user is User => {
  if (!user) {
    return false;
  }
  // Validate '_id' field if it exists
  if (user._id && !validateIdFn(user._id)) {
    console.log("Failed _id validation");
    return false;
  }

  console.log("Passed _id validation");

  if (user.clerkId && !isValidUserId(user.clerkId)) {
    return false;
  }

  console.log("Passed clerkId validation");

  const { _id, clerkId, ...userWithoutId } = user;

  return validateUserWithoutID(userWithoutId, validateIdFn);
};
