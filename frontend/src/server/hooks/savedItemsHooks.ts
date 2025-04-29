import { useQuery, useMutation } from "@tanstack/react-query";
import { SavedItemsApi } from "../api/savedItemsApi";
import { useQueryProps } from "@/types";
import { SAVED_ITEMS, SAVED_CATEGORIES } from "@/lib/constants/process";
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

export const useUpdateSavedItem = () => {
  const mutation = useMutation<SavedItem, Error, SavedItem>({
    mutationFn: (item: SavedItem) => SavedItemsApi.updateSavedItem(item),
  });

  return {
    updateSavedItem: mutation.mutateAsync,
    isUpdatingItem: mutation.isPending,
    updateError: mutation.error,
    updateData: mutation.data,
  };
}

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

export const useGetCategories = ({ enabled = true }: useQueryProps) => {
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: errorCategories,
    refetch: refetchCategories,
    isError: isErrorCategories,
  } = useQuery({
    queryKey: [SAVED_CATEGORIES],
    queryFn: SavedItemsApi.getAllSavedCategories,
    retry: 0,
    enabled,
  });

  return {
    categories,
    isLoadingCategories,
    refetchCategories,
    errorCategories,
    isErrorCategories,
  };
};

export const useDeleteCategory = () => {
  const mutation = useMutation<void, Error, string>({
    mutationFn: (category: string) => SavedItemsApi.deleteCategory(category),
  });

  return {
    deleteCategory: mutation.mutate,
    isDeletingCategory: mutation.isPending,
    deleteCategoryError: mutation.error,
    deleteCategoryData: mutation.data,
  };
};

export const useUpdateCategory = () => {
  const mutation = useMutation<
    void,
    Error,
    { oldCategory: string; newCategory: string }
  >({
    mutationFn: ({ oldCategory, newCategory }) =>
      SavedItemsApi.updateCategory(oldCategory, newCategory),
  });

  return {
    updateCategory: mutation.mutateAsync,
    isUpdatingCategory: mutation.isPending,
    updateCategoryError: mutation.error,
    updateCategoryData: mutation.data,
  };
};
