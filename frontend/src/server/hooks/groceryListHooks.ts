import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GroceryList, NewGroceryList } from "@/types/grocery";
import { useDataFetching } from "@/hooks/useDataFetching";
import { GroceryApi } from "../api/groceryListApi";
import { useQueryProps } from "@/types";
import { ERROR_FETCHING_GROCERY_LIST } from "@/lib/constants/messages";
import { GROCERY_LISTS } from "@/lib/constants/process";

export const useAllGroceryLists = ({
  metadata = true,
  enabled = true,
}: useQueryProps & { metadata: boolean }) => {
  const errorMessage = ERROR_FETCHING_GROCERY_LIST;

  const {
    data: groceryLists,
    isLoading: isLoadingGroceryLists,
    error: errorGroceryLists,
    isError: isErrorGroceryLists,
  } = useQuery({
    queryKey: [GROCERY_LISTS],
    queryFn: () => GroceryApi.fetchAllGroceryLists(metadata),
    retry: 0,
    enabled,
  });

  // useDataFetching({
  //   isLoading: isLoadingGroceryLists,
  //   isError: isErrorGroceryLists,
  //   error: errorGroceryLists,
  //   errorMessage,
  // });

  return {
    groceryLists,
    isLoadingGroceryLists,
    errorGroceryLists,
    isErrorGroceryLists,
  };
};

export const useFetchGroceryListById = ({
  id,
  enabled = true,
}: {
  id: string;
  enabled?: boolean;
}) => {
  const errorMessage = ERROR_FETCHING_GROCERY_LIST;

  const {
    data: groceryList,
    isLoading: isLoadingGroceryList,
    refetch: refetchGroceryList,
    error: errorGroceryList,
    isError: isErrorGroceryList,
  } = useQuery({
    queryKey: ["groceryList", id],
    queryFn: () => GroceryApi.fetchGroceryListById(id),
    enabled: !!id && enabled, // Only fetch if ID is valid
    retry: 0,
  });

  useDataFetching({
    isLoading: isLoadingGroceryList,
    isError: isErrorGroceryList,
    error: errorGroceryList,
    errorMessage,
  });

  return {
    groceryList,
    isLoadingGroceryList,
    refetchGroceryList,
    errorGroceryList,
  };
};

export const useCreateGroceryList = () => {
  const mutation = useMutation<GroceryList, Error, NewGroceryList>({
    mutationFn: (newList: NewGroceryList) =>
      GroceryApi.createGroceryList(newList),
    onSuccess: (data) => {
      console.log("Successfully created grocery list:", data);
    },
  });

  if (mutation.error) {
    console.error("Error creating list:", mutation.error);
  }

  return {
    createGroceryList: mutation.mutateAsync,
    isCreatingGroceryList: mutation.isPending,
    createError: mutation.error,
    createData: mutation.data,
  };
};

export const useUpdateGroceryList = () => {
  const mutation = useMutation<GroceryList, Error, GroceryList>({
    mutationFn: GroceryApi.updateGroceryList,
  });

  return {
    updatedGroceryList: mutation.data,
    updateGroceryList: mutation.mutate,
    isUpdatingGroceryList: mutation.isPending,
    updateError: mutation.error,
  };
};

export const useDeleteGroceryList = () => {
  const mutation = useMutation<void, Error, string>({
    mutationFn: GroceryApi.deleteGroceryList,
  });

  return {
    deleteGroceryListData: mutation.data,
    deleteGroceryList: mutation.mutate,
    isDeletingGroceryList: mutation.isPending,
    deleteError: mutation.error,
  };
};
