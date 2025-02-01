import { GroceryList } from "@/types/grocery";
import axios from "../axiosInstance";

export const fetchGroceryListById = async (id: string) => {
  try {
    const response = await axios.get(`/grocery?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting grocery list: ", error);
    throw error;
  }
};

export const createGroceryList = async (groceryList: GroceryList) => {
  try {
    const response = await axios.post("/grocery", groceryList);
    return response.data;
  } catch (error) {
    console.error("Error creating grocery list: ", error);
    throw error;
  }
};

export const updateGroceryList = async (groceryList: GroceryList) => {
  try {
    const response = await axios.put("/grocery", groceryList);
    return response.data;
  } catch (error) {
    console.error("Error updating grocery list: ", error);
    throw error;
  }
};

export const deleteGroceryList = async (id: string) => {
  try {
    const response = await axios.delete("/grocery", { data: { id } });
    return response.data;
  } catch (error) {
    console.error("Error deleting grocery list: ", error);
    throw error;
  }
};
