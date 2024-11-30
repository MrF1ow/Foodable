import { useQuery, useMutation } from "@tanstack/react-query";
import { GroceryList } from "@/types";
import {
  createGroceryList,
  deleteGroceryList,
  fetchGroceryListById,
  updateGroceryList,
} from "../api/groceryListApi";

export const useFetchGroceryListById = (id: string) => {
  return useQuery<GroceryList, Error>({
    queryKey: ["groceryList", id],
    queryFn: () => fetchGroceryListById(id),
  });
};

export const useCreateGroceryList = () => {
  return useMutation<GroceryList, Error, GroceryList>({
    mutationFn: createGroceryList,
  });
};

export const useUpdateGroceryList = () => {
  return useMutation<GroceryList, Error, GroceryList>({
    mutationFn: updateGroceryList,
  });
};

export const useDeleteGroceryList = () => {
  return useMutation<void, Error, string>({
    mutationFn: deleteGroceryList,
  });
};
