import { RecipeIngredient, Recipe, NewRecipe } from "@/types/recipe";
import { unitOptions } from "@/config/unit-conversions";
import { grocerySectionOptions } from "@/config/grocery-sections";
import { validateUserRating } from "./user";
import { isValidDate } from "./general";

export function validateRecipeIngredient(
  ingredient: any,
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
//// Original version with no error messages
// export const validateRecipeWithoutId = (
//   recipe: any,
//   validateIdFn: (id: any) => boolean
// ): recipe is NewRecipe => {
//   return (
//     recipe &&
//     validateIdFn(recipe.creatorId) &&
//     typeof recipe.title === "string" &&
//     typeof recipe.description === "string" &&
//     Array.isArray(recipe.ingredients) &&
//     Array.isArray(recipe.instructions) &&
//     Array.isArray(recipe.userRatings) &&
//     recipe.ingredients.every(validateRecipeIngredient) &&
//     recipe.instructions.every((instr: any) => typeof instr === "string") &&
//     // Check if all user ratings are valid if they exist
//     (recipe.userRatings.length === 0 ||
//       recipe.userRatings.every((rating: any) =>
//         validateUserRating(rating, validateIdFn)
//       )) &&
//     typeof recipe.averageRating === "number" &&
//     typeof recipe.priceApproximation === "number" &&
//     (recipe.timestamp === undefined || isValidDate(recipe.timestamp)) &&
//     (recipe.imageId === undefined || recipe.imageId === null || validateIdFn(recipe.imageId))
//   );
// };

//// ChatGPT version with verbose error messages
export const validateRecipeWithoutId = (
  recipe: any,
  validateIdFn: (id: any) => boolean,
): recipe is NewRecipe => {
  if (!recipe) {
    console.error("Recipe is null or undefined");
    return false;
  }
  if (!validateIdFn(recipe.creatorId)) {
    console.error("Invalid creatorId:", recipe.creatorId);
    return false;
  }
  if (typeof recipe.title !== "string") {
    console.error("Invalid title:", recipe.title);
    return false;
  }
  if (typeof recipe.description !== "string") {
    console.error("Invalid description:", recipe.description);
    return false;
  }
  if (!Array.isArray(recipe.ingredients)) {
    console.error("Ingredients is not an array:", recipe.ingredients);
    return false;
  }
  if (!Array.isArray(recipe.instructions)) {
    console.error("Instructions is not an array:", recipe.instructions);
    return false;
  }
  if (!Array.isArray(recipe.userRatings)) {
    console.error("UserRatings is not an array:", recipe.userRatings);
    return false;
  }
  if (!recipe.ingredients.every(validateRecipeIngredient)) {
    console.error(
      "Invalid ingredient detected in ingredients array:",
      recipe.ingredients,
    );
    return false;
  }
  if (!recipe.instructions.every((instr: any) => typeof instr === "string")) {
    console.error(
      "Invalid instruction detected in instructions array:",
      recipe.instructions,
    );
    return false;
  }
  if (
    recipe.userRatings.length > 0 &&
    !recipe.userRatings.every((rating: any) =>
      validateUserRating(rating, validateIdFn),
    )
  ) {
    console.error(
      "Invalid user rating detected in userRatings array:",
      recipe.userRatings,
    );
    return false;
  }
  if (typeof recipe.averageRating !== "number") {
    console.error("Invalid averageRating:", recipe.averageRating);
    return false;
  }
  if (typeof recipe.priceApproximation !== "number") {
    console.error("Invalid priceApproximation:", recipe.priceApproximation);
    return false;
  }
  if (recipe.timestamp !== undefined && !isValidDate(recipe.timestamp)) {
    console.error("Invalid timestamp:", recipe.timestamp);
    return false;
  }
  if (
    recipe.imageId !== undefined &&
    recipe.imageId !== null &&
    !validateIdFn(recipe.imageId)
  ) {
    console.error("Invalid imageId:", recipe.imageId);
    return false;
  }
  return true;
};

// Function to check if a recipe is valid
export const validateRecipe = (
  recipe: any,
  validateIdFn: (id: any) => boolean,
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
