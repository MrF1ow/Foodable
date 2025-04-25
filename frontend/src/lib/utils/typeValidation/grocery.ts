import { GroceryItem, GroceryList } from "@/types/grocery";
import { isValidDate } from "./general";
import { unitOptions } from "@/config/unit-conversions";
import { grocerySectionOptions } from "@/config/grocery-sections";
import { isValidUserId } from "./general";

export function validateGroceryItem(item: any): item is GroceryItem {
  return (
    item &&
    typeof item.name === "string" &&
    typeof item.quantity === "number" &&
    typeof item.unit === "string" &&
    Object.values(unitOptions).includes(item.unit) &&
    typeof item.category === "string" &&
    Object.values(grocerySectionOptions).includes(item.category) &&
    typeof item.checked === "boolean"
  );
}

export const validateGroceryListWithoutId = (
  groceryList: any,
  validateIdFn: (id: any) => boolean
): groceryList is GroceryList => {
  return (
    groceryList &&
    validateIdFn(groceryList.creatorId) &&
    typeof groceryList.title === "string" &&
    Array.isArray(groceryList.items) &&
    (groceryList.items.length === 0 ||
      groceryList.items.every(validateGroceryItem)) &&
    (groceryList.timestamp === undefined || isValidDate(groceryList.timestamp))
  );
};

// Function to check if a grocery list is valid
export const validateGroceryList = (
  groceryList: any,
  validateIdFn: (id: any) => boolean
): groceryList is GroceryList => {
  if (!groceryList) return false;

  if (groceryList._id && !validateIdFn(groceryList._id)) return false;

  const groceryListCopy = {
    ...groceryList,
    id:
      groceryList.id ??
      (groceryList._id ? groceryList._id.toString() : undefined),
  };
  delete groceryListCopy._id;

  return validateGroceryListWithoutId(groceryListCopy, validateIdFn);
};
