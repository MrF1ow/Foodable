import { GroceryList, NewGroceryList } from "@/types/grocery";
import axios from "../axiosInstance";

export const GroceryApi = {
  fetchGroceryListById: async (id: string) => {
    try {
      const response = await axios.get(`/grocery?id=${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting grocery list: ", error);
      throw error;
    }
  },
  createGroceryList: async (groceryList: NewGroceryList) => {
    try {
      const response = await axios.post("/grocery", groceryList);
      return response.data;
    } catch (error) {
      console.error("Error creating grocery list: ", error);
      throw error;
    }
  },
  updateGroceryList: async (groceryList: GroceryList) => {
    try {
      const response = await axios.put("/grocery", groceryList);
      return response.data;
    } catch (error) {
      console.error("Error updating grocery list: ", error);
      throw error;
    }
  },
  deleteGroceryList: async (id: string) => {
    try {
      const response = await axios.delete("/grocery", { data: { id } });
      return response.data;
    } catch (error) {
      console.error("Error deleting grocery list: ", error);
      throw error;
    }
  },
  fetchAllGroceryLists: async (includeMetadata = true) => {
    try {
      const baseUrl =
        typeof window === "undefined"
          ? process.env.NEXT_PUBLIC_API_BASE_URL
          : "";
      const queryParam = includeMetadata ? "?metadata=true" : "";
      const response = await axios.get(`${baseUrl}/grocery${queryParam}`);
      return response.data;
    } catch (error) {
      console.error("Error getting grocery lists: ", error);
      throw error;
    }
  },
};
