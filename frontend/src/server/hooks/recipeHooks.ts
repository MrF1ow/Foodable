import { useQuery, useMutation } from "@tanstack/react-query";
import { createRecipe, fetchRecipeById } from "../api/recipeApi";
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
