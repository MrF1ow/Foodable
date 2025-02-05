import { RecipeIngredient } from "@/types/recipe";
import { FilterTag, Tag } from "@/types";

export const createTagsForRecipe = (
  timeApproximation: number,
  ingredients: RecipeIngredient[],
  priceApproximation: number
): FilterTag => {
  const numIngredients = ingredients.length;

  let timeTag: Tag = 1;
  let priceTag: Tag = 1;
  let ingredientTag: Tag = 1;

  getTimeTag(timeApproximation);
  getPriceTag(priceApproximation);
  getIngredientTag(numIngredients);

  return {
    time: timeTag,
    price: priceTag,
    ingredient: ingredientTag,
  };
};

export function compareTag(
  a: number,
  b: number,
  direction: -1 | 0 | 1,
  tagType: 1 | 2 | 3
): number {
  const getTagValue = (value: number, tag: 1 | 2 | 3) => {
    switch (tag) {
      case 1: // Time tag
        return getTimeTag(value);
      case 2: // Price tag
        return getPriceTag(value);
      case 3: // Ingredient tag
        return getIngredientTag(value);
      default:
        return 0;
    }
  };

  const tagA = getTagValue(a, tagType);
  const tagB = getTagValue(b, tagType);

  if (direction === 0) return 0;
  if (direction === 1) return tagA - tagB;
  return tagB - tagA;
}

function getTimeTag(time: number): number {
  if (time <= 15) return 1;
  if (time <= 30) return 2;
  if (time <= 45) return 3;
  if (time <= 60) return 4;
  return 5;
}

// Mapping function for Price tag (1-5)
function getPriceTag(price: number): number {
  if (price <= 5) return 1;
  if (price <= 10) return 2;
  if (price <= 15) return 3;
  if (price <= 20) return 4;
  return 5;
}

// Mapping function for Ingredient tag (1-5)
function getIngredientTag(ingredientCount: number): number {
  if (ingredientCount <= 5) return 1;
  if (ingredientCount <= 8) return 2;
  if (ingredientCount <= 12) return 3;
  if (ingredientCount <= 16) return 4;
  return 5;
}
