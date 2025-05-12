import { GroceryItem } from "@/types/grocery";
import { RecipeIngredient } from "@/types/recipe";
import { convertAmount, isConvertable } from "./converstions";


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

    return recipeIngredientsToGroceryItems(additionalIngredients);
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
        productId: undefined
    }));
};