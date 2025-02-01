import { useMutation } from "@tanstack/react-query";
import { saveItem, removeSavedItem } from "../api/savedItemsApi";
import { Recipe } from "@/types/recipe";
import { GroceryList } from "@/types/grocery";

export const useSaveItem = () => {
  return useMutation<void, Error, Recipe | GroceryList>({
    mutationFn: saveItem,
  });
};

export const useRemoveSavedItem = () => {
  return useMutation<void, Error, Recipe | GroceryList>({
    mutationFn: removeSavedItem,
  });
};
