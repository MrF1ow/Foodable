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

export const updateRecipe = async (recipe: Recipe) => {
  try {
    const response = await axios.put("/recipe", recipe);
    return response.data;
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw error;
  }
};

export const deleteRecipe = async (id: string) => {
  try {
    const response = await axios.delete("/recipe", { data: { id } });
    return response.data;
  } catch (error) {
    console.error("Error deleting recipe:", error);
    throw error;
  }
};

export const fetchRecipesByCreatorId = async (creatorId: string) => {
  try {
    const response = await axios.get(`/recipe?creatorId=${creatorId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting recipe:", error);
    throw error;
  }
};

export const fetchAllRecipes = async () => {
  try {
    const response = await axios.get("/recipe");
    return response.data;
  } catch (error) {
    console.error("Error getting recipes:", error);
    throw error;
  }
};

export const fetchRecipesByTitle = async (title: string) => {
  try {
    const response = await axios.get(`/recipe?title=${title}`);
    return response.data;
  } catch (error) {
    console.error("Error getting recipe:", error);
    throw error;
  }
};
