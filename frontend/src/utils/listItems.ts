import { unitConversions } from "@/config/unit-conversions";
import { Units } from "@/types";
import { RecipeIngredient } from "@/types/recipe";
import { GroceryItem, GrocerySectionOptions } from "@/types/grocery";
import { useGroceryStore } from "@/stores/grocery/store";
import { grocerySections } from "@/config/grocery-sections";
import { MainMetaData } from "@/types/saved";

export const getCurrentGrocerySections = () => {
  const currentCategories = useGroceryStore((state) => state.currentCategories);

  return grocerySections.filter((section) =>
    currentCategories.some((category) => category === section.title)
  );
};

export function convertAmount(
  amount: number,
  fromUnit: Units,
  toUnit: Units
): number {
  if (fromUnit === toUnit) return amount;

  if (!unitConversions[fromUnit] || !unitConversions[fromUnit][toUnit]) {
    console.error(`No conversion available from ${fromUnit} to ${toUnit}`);
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
  return items.filter((item) => item.category === accordionCategory);
};

export const getIndexOfItemInArray = (
  itemName: string,
  items: (GroceryItem | RecipeIngredient | MainMetaData | string)[]
) => {
  return items.findIndex((item) => item === itemName);
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
