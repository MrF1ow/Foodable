import { Recipe, NewRecipe } from "@/types/recipe";
import fetchWithAuth from "../fetchInstance";
import { FilterOptions, FilterTag, Tag } from "@/types";

export const RecipeApi = {
  createRecipe: async (recipe: NewRecipe): Promise<Recipe> => {
    try {
      const response = await fetchWithAuth("/user/recipes", {
        method: "POST",
        body: JSON.stringify(recipe),
      });
      return response;
    } catch (error) {
      console.error("Error creating recipe:", error);
      throw error;
    }
  },

  fetchRecipeById: async (id: string) => {
    try {
      const response = await fetchWithAuth(`/recipes?id=${id}`);
      return response;
    } catch (error) {
      console.error("Error getting recipe:", error);
      throw error;
    }
  },

  updateRecipe: async (recipe: Recipe): Promise<Recipe> => {
    try {
      const response = await fetchWithAuth("/user/recipes", {
        method: "PUT",
        body: JSON.stringify(recipe),
      });
      return response;
    } catch (error) {
      console.error("Error updating recipe:", error);
      throw error;
    }
  },

  deleteRecipe: async (id: string): Promise<Recipe> => {
    try {
      const response = await fetchWithAuth("/user/recipes", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      return response;
    } catch (error) {
      console.error("Error deleting recipe:", error);
      throw error;
    }
  },

  fetchRecipesByCreatorId: async (creatorId: string) => {
    try {
      const response = await fetchWithAuth(`/recipes?creatorId=${creatorId}`);
      return response;
    } catch (error) {
      console.error("Error getting recipe:", error);
      throw error;
    }
  },

  fetchAllRecipes: async (includeMetadata = true, tags?: FilterTag) => {
    try {
      const params = new URLSearchParams();
      if (includeMetadata) params.append("metadata", "true");

      if (tags?.time) params.append("time", tags.time.toString());
      if (tags?.price) params.append("price", tags.price.toString());
      if (tags?.ingredient) params.append("ingredient", tags.ingredient.toString());

      const queryString = params.toString();
      const url = `/recipes${queryString ? `?${queryString}` : ""}`;
      const response = await fetchWithAuth(url);
      return response;
    } catch (error) {
      console.error("Error getting recipes:", error);
      throw error;
    }
  },

  fetchRecipesByTitle: async (title: string) => {
    try {
      const response = await fetchWithAuth(`/recipes?title=${title}`);
      return response;
    } catch (error) {
      console.error("Error getting recipe:", error);
      throw error;
    }
  },
};
