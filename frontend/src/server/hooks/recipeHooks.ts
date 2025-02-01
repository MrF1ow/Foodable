import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createRecipe,
  deleteRecipe,
  fetchRecipeById,
  updateRecipe,
  fetchRecipesByCreatorId,
  fetchAllRecipes,
  fetchRecipesByTitle,
} from "../api/recipeApi";
import { Recipe } from "@/types/recipe";

export const useCreateRecipe = () => {
  return useMutation<Recipe, Error, Recipe>({ mutationFn: createRecipe });
};

export const useFetchRecipeById = (id: string) => {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: () => fetchRecipeById(id),
  });
};

export const useUpdateRecipe = () => {
  return useMutation<Recipe, Error, Recipe>({ mutationFn: updateRecipe });
};

export const useDeleteRecipe = () => {
  return useMutation<void, Error, string>({ mutationFn: deleteRecipe });
};

export const useFetchRecipesByCreatorId = (creatorId: string) => {
  return useQuery({
    queryKey: ["creatorId", creatorId],
    queryFn: () => fetchRecipesByCreatorId(creatorId),
  });
};

export const useFetchRecipes = () => {
  return useQuery<Recipe[], Error>({
    queryKey: ["allRecipes"],
    queryFn: fetchAllRecipes,
  });
};

export const useFetchRecipesByTitle = (title: string) => {
  return useQuery<Recipe[], Error>({
    queryKey: ["recipesByTitle", title],
    queryFn: () => fetchRecipesByTitle(title),
    enabled: !!title, // this prevents automatic fetching until searchQuery is set
  });
};
