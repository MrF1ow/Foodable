import { useQuery, useMutation } from "@tanstack/react-query";
import { GroceryList } from "@/types/grocery";
import { GroceryApi } from "../api/groceryListApi";

export const useFetchGroceryListById = (id: string) => {
  return useQuery<GroceryList, Error>({
    queryKey: ["groceryList", id],
    queryFn: () => GroceryApi.fetchGroceryListById(id),
  });
};

export const useCreateGroceryList = () => {
  return useMutation<GroceryList, Error, GroceryList>({
    mutationFn: GroceryApi.createGroceryList,
  });
};

export const useUpdateGroceryList = () => {
  return useMutation<GroceryList, Error, GroceryList>({
    mutationFn: GroceryApi.updateGroceryList,
  });
};

export const useDeleteGroceryList = () => {
  return useMutation<void, Error, string>({
    mutationFn: GroceryApi.deleteGroceryList,
  });
};
