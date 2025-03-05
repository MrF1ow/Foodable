import { useQuery, useMutation } from "@tanstack/react-query";
import { GroceryList, NewGroceryList } from "@/types/grocery";
import { GroceryApi } from "../api/groceryListApi";
import { useQueryProps } from "@/types";
import { GROCERY_LISTS } from "@/lib/constants/process";

export const useAllGroceryLists = ({
  metadata,
  enabled = true,
}: useQueryProps & { metadata: boolean }) => {
  const {
    data: groceryLists,
    isLoading: isLoadingGroceryLists,
    error: errorGroceryLists,
    refetch: refetchGroceryLists,
    isError: isErrorGroceryLists,
  } = useQuery({
    queryKey: [GROCERY_LISTS],
    queryFn: () => GroceryApi.fetchAllGroceryLists(metadata),
    retry: 2,
    enabled,
  });

  return {
    groceryLists,
    isLoadingGroceryLists,
    refetchGroceryLists,
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
  const {
    data: groceryList,
    isLoading: isLoadingGroceryList,
    refetch: refetchGroceryList,
    error: errorGroceryList,
    isError: isErrorGroceryList,
  } = useQuery({
    queryKey: [GROCERY_LISTS, id],
    queryFn: () => GroceryApi.fetchGroceryListById(id),
    enabled: !!id && enabled, // Only fetch if ID is valid
    retry: 0,
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
    updateGroceryList: mutation.mutateAsync,
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
