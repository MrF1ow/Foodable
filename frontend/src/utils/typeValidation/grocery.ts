import { GroceryItem, GroceryList } from "@/types/grocery";

export function validateGroceryItem(item: any): item is GroceryItem {
  return (
    item &&
    typeof item.name === "string" &&
    typeof item.quantity === "number" &&
    typeof item.brand === "string"
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
    (groceryList.timestamp === undefined ||
      (groceryList.timestamp instanceof Date &&
        !isNaN(groceryList.timestamp.getTime())))
  );
};

// Function to check if a grocery list is valid
export const validateGroceryList = (
  groceryList: any,
  validateIdFn: (id: any) => boolean
): groceryList is GroceryList => {
  if (!groceryList) {
    return false;
  }

  if (groceryList.id && !validateIdFn(groceryList.id)) {
    return false;
  }

  if (groceryList._id && !validateIdFn(groceryList._id)) {
    return false;
  }

  const { _id, id, ...groceryListWithoutId } = groceryList;

  return validateGroceryListWithoutId(groceryListWithoutId, validateIdFn);
};
