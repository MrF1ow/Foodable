import { GroceryList, NewGroceryList } from "@/types/grocery";

import fetchWithAuth from "../fetchInstance";

export const GroceryApi = {
  fetchAllGroceryLists: async (includeMetadata: boolean) => {
    try {
      const queryParam = includeMetadata ? "?metadata=true" : "";
      const url = `/user/grocery${queryParam}`;
      const response = await fetchWithAuth(url, {
        method: "GET",
      });
      return response;
    } catch (error) {
      console.error("Error getting grocery lists: ", error);
      throw error;
    }
  },
  fetchGroceryListById: async (id: string) => {
    try {
      const response = await fetchWithAuth(`/user/grocery?id=${id}`);
      return response;
    } catch (error) {
      console.error("Error getting grocery list: ", error);
      throw error;
    }
  },
  createGroceryList: async (groceryList: NewGroceryList) => {
    try {
      const response = await fetchWithAuth("/user/grocery", {
        method: "POST",
        body: JSON.stringify(groceryList),
      });
      return response;
    } catch (error) {
      console.error("Error creating grocery list: ", error);
      throw error;
    }
  },
  updateGroceryList: async (groceryList: GroceryList) => {
    try {
      console.log("Updating groceryList: ", groceryList);
      const response = await fetchWithAuth("/user/grocery", {
        method: "PUT",
        body: JSON.stringify(groceryList),
      });
      return response;
    } catch (error) {
      console.error("Error updating grocery list: ", error);
      throw error;
    }
  },
  deleteGroceryList: async (id: string) => {
    try {
      const response = await fetchWithAuth("/user/grocery", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      return response;
    } catch (error) {
      console.error("Error deleting grocery list: ", error);
      throw error;
    }
  },
};
