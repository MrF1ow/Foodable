import { Recipe } from "@/types/recipe";
import axios from "../axiosInstance";

export const RecipeApi = {
  createRecipe: async (recipe: Recipe) => {
    try {
      const response = await axios.post("/recipes", recipe);
      return response.data;
    } catch (error) {
      console.error("Error creating recipe:", error);
      throw error;
    }
  },

  fetchRecipeById: async (id: string) => {
    try {
      const response = await axios.get(`/recipes?id=${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting recipe:", error);
      throw error;
    }
  },

  updateRecipe: async (recipe: Recipe) => {
    try {
      const response = await axios.put("/recipes", recipe);
      return response.data;
    } catch (error) {
      console.error("Error updating recipe:", error);
      throw error;
    }
  },

  deleteRecipe: async (id: string) => {
    try {
      const response = await axios.delete("/recipes", { data: { id } });
      return response.data;
    } catch (error) {
      console.error("Error deleting recipe:", error);
      throw error;
    }
  },

  fetchRecipesByCreatorId: async (creatorId: string) => {
    try {
      const response = await axios.get(`/recipes?creatorId=${creatorId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting recipe:", error);
      throw error;
    }
  },

  fetchAllRecipes: async () => {
    try {
      const response = await axios.get("/recipes?metadata=true");
      return response.data;
    } catch (error) {
      console.error("Error getting recipes:", error);
      throw error;
    }
  },

  fetchRecipesByTitle: async (title: string) => {
    try {
      const response = await axios.get(`/recipes?title=${title}`);
      return response.data;
    } catch (error) {
      console.error("Error getting recipe:", error);
      throw error;
    }
  },
};
