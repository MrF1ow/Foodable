import { unitConversions } from "@/config/unit-conversions";
import { FilterOptions, Units } from "@/types";
import { Recipe, RecipeIngredient } from "@/types/recipe";
import {
  GroceryItem,
  GroceryList,
  GrocerySectionOptions,
} from "@/types/grocery";
import { useGroceryStore } from "@/stores/grocery/store";
import { grocerySections } from "@/config/grocery-sections";
import { RecipeMetaData, SavedItem } from "@/types/saved";
import { compareTag } from "./filterHelpers";
import { FollowMetadata } from "@/types/user";

export const getCurrentGrocerySections = () => {
  const currentCategories = useGroceryStore((state) => state.currentCategories);

  return grocerySections.filter((section) =>
    currentCategories.some((category) => category === section.title)
  );
};

export function isConvertable(fromUnit: Units, toUnit: Units): boolean {
  return (
    unitConversions[fromUnit] !== undefined &&
    unitConversions[fromUnit][toUnit] !== undefined
  );
}

export function convertAmount(
  amount: number,
  fromUnit: Units,
  toUnit: Units
): number {
  if (fromUnit === toUnit) return amount;

  if (!unitConversions[fromUnit] || !unitConversions[fromUnit][toUnit]) {
    return amount;
  }

  return amount * unitConversions[fromUnit][toUnit];
}

export function getMissingIngredients(
  recipeIngredients: RecipeIngredient[],
  groceryMap: Map<string, GroceryItem>
): RecipeIngredient[] {
  const missingIngredients: RecipeIngredient[] = [];

  recipeIngredients.forEach((recipeItem) => {
    const groceryItem = groceryMap.get(recipeItem.name.toLowerCase());

    if (!groceryItem) {
      // If the grocery item does not exist, add it to the missing ingredients
      missingIngredients.push(recipeItem);
    } else {
      if (!isConvertable(groceryItem.unit, recipeItem.unit)) {
        // If the units are not convertable, add it to the missing ingredients
        missingIngredients.push(recipeItem);
        return;
      }
      const convertedQuantity = convertAmount(
        groceryItem.quantity,
        groceryItem.unit,
        recipeItem.unit
      );
      if (convertedQuantity < recipeItem.quantity) {
        // If the grocery item quantity is less than the recipe item quantity, add it to the missing ingredients
        missingIngredients.push({
          ...recipeItem,
          quantity: recipeItem.quantity - convertedQuantity,
        });
      }
    }
  });

  return missingIngredients;
}

export const getAdditionalIngredients = (
  recipeIngredients: RecipeIngredient[],
  groceryMap: Map<string, GroceryItem>
) => {
  const additionalIngredients = getMissingIngredients(
    recipeIngredients,
    groceryMap
  );

  const groceryItemAdditionalIngredients = recipeIngredientsToGroceryItems(
    additionalIngredients
  );

  return groceryItemAdditionalIngredients;
};

export const getGroceryAccordingItems = (
  accordionCategory: GrocerySectionOptions,
  items: GroceryItem[]
) => {
  if (!items) return;
  return items.length === 0
    ? []
    : items.filter((item) => item.category === accordionCategory);
};

export const recipeIngredientsToGroceryItems = (
  recipeIngredients: RecipeIngredient[]
): GroceryItem[] => {
  return recipeIngredients.map((ingredient) => ({
    name: ingredient.name,
    quantity: ingredient.quantity,
    unit: ingredient.unit,
    category: ingredient.category,
    checked: false,
  }));
};

export const getIsItemSaved = (
  item: Recipe | GroceryList,
  savedItems: SavedItem[]
) => {
  return savedItems.some((savedItem) => savedItem._id === item._id);
};

export const insertItemIntoGroceryMap = (
  item: GroceryItem,
  groceryMap: Map<string, GroceryItem>
) => {
  const newMap = groceryMap;
  const existingItem = groceryMap.get(item.name.toLowerCase());
  if (existingItem) {
    const convertedQuantity = convertAmount(
      item.quantity,
      item.unit,
      existingItem.unit
    );
    existingItem.quantity += convertedQuantity;
    newMap.set(item.name.toLowerCase(), existingItem);
  } else {
    newMap.set(item.name.toLowerCase(), {
      ...item,
      checked: false,
    });
  }
  return newMap;
};

export const filterRecipes = (
  recipes: RecipeMetaData[],
  filter: FilterOptions
): RecipeMetaData[] => {
  let filteredRecipes = [...recipes];

  // Filter by search query
  if (filter.searchQuery) {
    filteredRecipes = filteredRecipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(filter.searchQuery.toLowerCase())
    );
  }

  // Sorting function
  filteredRecipes.sort((a, b) => {
    let result = 0;

    if (filter.timeApprox !== 0) {
      result = compareTag(a.tags.time, b.tags.time, filter.timeApprox);
    }
    if (result === 0 && filter.price !== 0) {
      result = compareTag(a.tags.price, b.tags.price, filter.price);
    }
    if (result === 0 && filter.ingredientAmount !== 0) {
      result = compareTag(
        a.tags.ingredient,
        b.tags.ingredient,
        filter.ingredientAmount
      );
    }

    return result;
  });

  return filteredRecipes;
};

export const filterUsers = (users: FollowMetadata[], searchQuery: string) => {
  return users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
};
