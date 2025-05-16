import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    enabled,
    retry: 2,
  });

  return {
    groceryList,
    isLoadingGroceryList,
    refetchGroceryList,
    errorGroceryList,
    isErrorGroceryList,
  };
};

export const useCreateGroceryList = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<GroceryList, Error, NewGroceryList>({
    mutationFn: (newList: NewGroceryList) =>
      GroceryApi.createGroceryList(newList),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GROCERY_LISTS] });
    },

    onError: (error) => {
      console.error("Error creating list:", error);
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
  const queryClient = useQueryClient();

  const mutation = useMutation<GroceryList, Error, GroceryList>({
    mutationFn: GroceryApi.updateGroceryList,

    onSuccess: (updatedList) => {
      queryClient.setQueryData<GroceryList[]>([GROCERY_LISTS], (oldLists) =>
        oldLists?.map((list) =>
          list._id === updatedList._id ? updatedList : list
        )
      );
    },

    onError: (error) => {
      console.error("Error updating list:", error);
    },
  });

  return {
    updatedGroceryList: mutation.data,
    updateGroceryList: mutation.mutateAsync,
    isUpdatingGroceryList: mutation.isPending,
    updateError: mutation.error,
  };
};

export const useDeleteGroceryList = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<void, Error, string>({
    mutationFn: GroceryApi.deleteGroceryList,

    onSuccess: (__, id) => {
      queryClient.setQueryData<GroceryList[]>([GROCERY_LISTS], (oldLists) =>
        oldLists?.filter((list) => list._id !== id)
      );
    },

    onError: (error) => {
      console.error("Error deleting list:", error);
    },
  });

  return {
    deleteGroceryListData: mutation.data,
    deleteGroceryList: mutation.mutate,
    isDeletingGroceryList: mutation.isPending,
    deleteError: mutation.error,
  };
};
