import { GroceryList } from "@/types";
import axios from "../axiosInstance";
import { GoodPageCache } from "next/dist/client/page-loader";

export const fetchGroceryListById = async (id: string) => {
  try {
    const response = await axios.get(`/groceryList?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting grocery list: ", error);
    throw error;
  }
};

export const createGroceryList = async (groceryList: GroceryList) => {
  try {
    const response = await axios.post("/groceryList", groceryList);
    return response.data;
  } catch (error) {
    console.error("Error creating grocery list: ", error);
    throw error;
  }
};

export const updateGroceryList = async (groceryList: GroceryList) => {
  try {
    const response = await axios.put("/groceryList", groceryList);
    return response.data;
  } catch (error) {
    console.error("Error updating grocery list: ", error);
    throw error;
  }
};

export const deleteGroceryList = async (id: string) => {
  try {
    const response = await axios.delete("/groceryList", { data: { id } });
    return response.data;
  } catch (error) {
    console.error("Error deleting grocery list: ", error);
    throw error;
  }
};
