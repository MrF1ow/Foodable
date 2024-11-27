import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createRecipe,
  deleteRecipe,
  fetchRecipeById,
  updateRecipe,
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
