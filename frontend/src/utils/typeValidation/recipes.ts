import { RecipeIngredient, Recipe, NewRecipe } from "@/types/recipe";
import { unitOptions } from "@/config/unit-conversions";
import { grocerySectionOptions } from "@/config/grocery-sections";
import { validateUserRating } from "./user";
import { isValidDate } from "./general";

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

export const validateRecipeWithoutId = (
  recipe: any,
  validateIdFn: (id: any) => boolean
): recipe is NewRecipe => {
  return (
    recipe &&
    validateIdFn(recipe.creatorId) &&
    typeof recipe.title === "string" &&
    typeof recipe.description === "string" &&
    Array.isArray(recipe.ingredients) &&
    Array.isArray(recipe.instructions) &&
    Array.isArray(recipe.userRatings) &&
    recipe.ingredients.every(validateRecipeIngredient) &&
    recipe.instructions.every((instr: any) => typeof instr === "string") &&
    // Check if all user ratings are valid if they exist
    (recipe.userRatings.length === 0 ||
      recipe.userRatings.every((rating: any) =>
        validateUserRating(rating, validateIdFn)
      )) &&
    typeof recipe.averageRating === "number" &&
    typeof recipe.priceApproximation === "number" &&
    (recipe.timestamp === undefined || isValidDate(recipe.timestamp)) &&
    (recipe.imageId === undefined || validateIdFn(recipe.imageId))
  );
};

// Function to check if a recipe is valid
export const validateRecipe = (
  recipe: any,
  validateIdFn: (id: any) => boolean
): recipe is Recipe => {
  if (!recipe) return false;

  // Ensure either `id` (string) or `_id` (ObjectId) is present, but not both
  if (recipe.id && typeof recipe.id !== "string") return false;
  if (recipe._id && !validateIdFn(recipe._id)) return false;
  if (recipe.id && recipe._id) return false; // Ensures mutual exclusivity

  // Convert `_id` to `id` for validation consistency
  const recipeCopy = {
    ...recipe,
    id: recipe.id ?? (recipe._id ? recipe._id.toString() : undefined),
  };
  delete recipeCopy._id;

  return validateRecipeWithoutId(recipeCopy, validateIdFn);
};
