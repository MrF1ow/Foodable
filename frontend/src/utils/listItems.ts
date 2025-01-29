import { unitConversions } from "@/config/unit-conversions";
import { Units } from "@/types";
import { RecipeIngredient } from "@/types/recipe";
import { GroceryItem } from "@/types/grocery";
import { useGroceryStore } from "@/stores/grocery/store";

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
  recipeIngredients: RecipeIngredient[]
) => {
  const groceryMap = useGroceryStore((state) => state.map);

  const additionalIngredients = getMissingIngredients(
    recipeIngredients,
    groceryMap
  );

  return additionalIngredients;
};
