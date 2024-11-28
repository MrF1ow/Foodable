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
import { Recipe } from "@/types";

export const useCreateUser = () => {
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
  return useMutation<void, Error, string>({ mutationFn: fetchAllRecipes });
};

export const useFetchRecipesByTitle = (title: string) => {
  return useQuery({
    queryKey: ["title", title],
    queryFn: () => fetchRecipesByTitle(title),
  });
};
