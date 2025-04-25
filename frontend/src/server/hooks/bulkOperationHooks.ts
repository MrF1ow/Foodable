
import { useMutation } from "@tanstack/react-query";
import { BulkOperationApi } from "../api";

export const useRemoveAllGroceryListFromAllUsers = () => {
    const mutation = useMutation<void, Error, string>({
        mutationFn: (listId: string) =>
            BulkOperationApi.bulkRemoveGroceryListFromAllUsers(listId),
    });

    return {
        removeAllGroceryListFromAllUsers: mutation.mutateAsync,
        isRemovingGroceryList: mutation.isPending,
        removeError: mutation.error,
        removeData: mutation.data,
    };
}

export const useRemoveAllRecipesFromAllUsers = () => {
    const mutation = useMutation<void, Error, string>({
        mutationFn: (recipeId: string) =>
            BulkOperationApi.bulkRemoveRecipesFromAllUsers(recipeId),
    });

    return {
        removeAllRecipesFromAllUsers: mutation.mutateAsync,
        isRemovingRecipes: mutation.isPending,
        removeError: mutation.error,
        removeData: mutation.data,
    };
}