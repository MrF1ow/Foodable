import { useEffect, useRef, useState } from "react";
import {
  useFetchAllGroceryLists,
  useFetchGroceryListById,
} from "@/server/hooks/groceryListHooks";
import { useGroceryStore } from "@/stores/grocery/store";
import { GroceryList, GroceryListMainInfo } from "@/types/grocery";
import { useDeleteGroceryList } from "@/server/hooks/groceryListHooks";

export const GroceryListDeleter = () => {
  const { deleteGroceryList, isDeletingGroceryList, deleteError } =
    useDeleteGroceryList();
  const {
    removeCurrentList,
    currentList,
    currentLists,
    listDeleted,
    setListDeleted,
    setCurrentList,
    setCurrentLists,
  } = useGroceryStore((state) => state);
  const hasDeleted = useRef(false);

  useEffect(() => {
    if (listDeleted && !hasDeleted.current) {
      console.log("Current Lists from deleter", currentLists);
      console.log("GroceryDeleter", currentList.title, currentList._id);
      deleteGroceryList(currentList._id);
      removeCurrentList(currentList.title);
      setCurrentList({ title: "New List", _id: undefined, category: "" });
      setListDeleted(false);
      hasDeleted.current = true;
    }
  }, [currentList._id]);

  if (isDeletingGroceryList) return <p>Deleting Grocery List...</p>;
  if (deleteError)
    return <p>Error deleting Grocery List: {deleteError.message}</p>;

  return null;
};
