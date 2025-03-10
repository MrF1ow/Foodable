import { SavedItem } from "@/types/saved";
import fetchWithAuth from "../fetchInstance";
import { get } from "node_modules/cypress/types/lodash";

export const SavedItemsApi = {
  getAllSavedItems: async () => {
    try {
      const data = await fetchWithAuth("/user/saved-items/items");
      return data;
    } catch (error) {
      console.error("Error getting all saved items:", error);
      return null;
    }
  },

  saveItem: async (data: SavedItem) => {
    try {
      const response = await fetchWithAuth("/user/saved-items/items", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  },

  deleteItem: async (data: SavedItem) => {
    try {
      const response = await fetchWithAuth("/user/saved-items/items", {
        method: "DELETE",
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  },

  getAllSavedCategories: async () => {
    try {
      const response = await fetchWithAuth("/user/saved-items/categories");
      return response;
    } catch (error) {
      console.error("Error getting categories:", error);
      return null;
    }
  },

  deleteCategory: async (category: string) => {
    try {
      const response = await fetchWithAuth("/user/saved-items/categories", {
        method: "DELETE",
        body: JSON.stringify({ category }),
      });
      return response;
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  },

  updateCategory: async (oldCategory: string, newCategory: string) => {
    try {
      const response = await fetchWithAuth("/user/saved-items/categories", {
        method: "PUT",
        body: JSON.stringify({ oldCategory, newCategory }),
      });
      return response;
    } catch (error) {
      console.error("Error updating category:", error);
    }
  },
};
