import { Recipe } from "@/types";
import axios from "../axiosInstance";

export const createRecipe = async (recipe: Recipe) => {
  try {
    const response = await axios.post("/recipe", recipe);
    return response.data;
  } catch (error) {
    console.error("Error creating recipe:", error);
    throw error;
  }
};

export const fetchRecipeById = async (id: string) => {
  try {
    const response = await axios.get(`/recipe?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting recipe:", error);
    throw error;
  }
};
