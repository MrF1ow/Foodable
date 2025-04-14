import fetchWithAuth from "../fetchInstance";

export const BulkOperationApi = {
    bulkRemoveGroceryListFromAllUsers: async (listId: string) => {
        try {
            const response = await fetchWithAuth("/user/bulk", {
                method: "DELETE",
                body: JSON.stringify({ id: listId, type: "grocery" }),
            });
            return response;
        } catch (error) {
            console.error("Error removing grocery list from all users:", error);
            throw error;
        }
    },
    bulkRemoveRecipesFromAllUsers: async (recipeId: string) => {
        try {
            const response = await fetchWithAuth("/user/bulk", {
                method: "DELETE",
                body: JSON.stringify({ id: recipeId, type: "recipe" }),
            });
            return response;
        } catch (error) {
            console.error("Error removing recipes from all users:", error);
            throw error;
        }
    },
}

