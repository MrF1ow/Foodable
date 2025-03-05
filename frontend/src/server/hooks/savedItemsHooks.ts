import { useQuery, useMutation } from "@tanstack/react-query";
import { SavedItemsApi } from "../api/savedItemsApi";
import { useQueryProps } from "@/types";
import { SAVED_ITEMS } from "@/lib/constants/process";
import { SavedItem } from "@/types/saved";

export const useAllSavedItems = ({ enabled = true }: useQueryProps) => {
  const {
    data: savedItems,
    isLoading: isLoadingSavedItems,
    error: errorSavedItems,
    refetch: refetchSavedItems,
    isError: isErrorSavedItems,
  } = useQuery({
    queryKey: [SAVED_ITEMS],
    queryFn: SavedItemsApi.getAllSavedItems,
    retry: 2,
    enabled,
  });

  return {
    savedItems,
    isLoadingSavedItems,
    refetchSavedItems,
    errorSavedItems,
    isErrorSavedItems,
  };
};

export const useCreateSavedItem = () => {
  const mutation = useMutation<SavedItem, Error, SavedItem>({
    mutationFn: (newSavedItem: SavedItem) =>
      SavedItemsApi.saveItem(newSavedItem),
  });

  return {
    createSavedItem: mutation.mutateAsync,
    isCreatingSavedItem: mutation.isPending,
    createError: mutation.error,
    createData: mutation.data,
  };
};

export const useDeleteSavedItem = () => {
  const mutation = useMutation<void, Error, SavedItem>({
    mutationFn: (item: SavedItem) => SavedItemsApi.deleteItem(item),
  });

  return {
    deleteSavedItem: mutation.mutate,
    isDeletingSavedItem: mutation.isPending,
    deleteError: mutation.error,
    deleteData: mutation.data,
  };
};
