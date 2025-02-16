import { useEffect } from "react";
import {
  useFetchAllGroceryLists,
  useFetchGroceryListById,
} from "@/server/hooks/groceryListHooks";
import { useGroceryStore } from "@/stores/grocery/store";
import { GroceryList } from "@/types/grocery";
import { useUpdateGroceryList } from "@/server/hooks/groceryListHooks";

export const GroceryListsUpdater = () => {
  const {
    groceryLists,
    items,
    setCurrentGroceryLists,
    setItems,
    addItem,
    currentList,
  } = useGroceryStore((state) => state);

  const { updateGroceryList, isUpdatingGroceryList } = useUpdateGroceryList();
  const { data: groceryList } =
    currentList.title !== "New List"
      ? useFetchGroceryListById(currentList._id)
      : { data: null };
  useEffect(() => {
    if (groceryList) {
      if (groceryList && groceryList.items !== items) {
        if (groceryList) {
          const updatedList = { ...groceryList, items };
          updateGroceryList(updatedList);
        }
      }
    }
  }, [items]);

  return isUpdatingGroceryList ? <p>Updating grocery lists...</p> : null;
};
