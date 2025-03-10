import { SavedItem } from "@/types/saved";
import fetchWithAuth from "../fetchInstance";

export const SavedItemsApi = {
  getAllSavedItems: async () => {
    try {
      const data = await fetchWithAuth("/user/saved-items");
      return data;
    } catch (error) {
      console.error("Error getting all saved items:", error);
      return null;
    }
  },

  saveItem: async (data: SavedItem) => {
    try {
      const response = await fetchWithAuth("/user/saved-items", {
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
      const response = await fetchWithAuth("/user/saved-items", {
        method: "DELETE",
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  },
};
