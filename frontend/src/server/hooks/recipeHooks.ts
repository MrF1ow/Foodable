import { useQuery, useMutation } from "@tanstack/react-query";
import { RecipeApi } from "../api/recipeApi";
import { useDataFetching } from "@/hooks/useDataFetching";
import { useQueryProps } from "@/types";
import { ERROR_FETCHING_RECIPES } from "@/lib/constants/messages";
import { RECIPES } from "@/lib/constants/process";
import { Recipe, NewRecipe } from "@/types/recipe";
import { FilterTag } from "@/types";

export const useAllRecipes = (metadata: boolean = true, tags?: FilterTag) => {
  const {
    data: recipes,
    refetch: refetchRecipes,
    isLoading: isLoadingRecipes,
    error: errorRecipes,
    isError: isErrorRecipes,
  } = useQuery({
    queryKey: [RECIPES, tags],
    queryFn: () => RecipeApi.fetchAllRecipes(metadata, tags),
  });

  return { recipes, refetchRecipes, isLoadingRecipes, errorRecipes, isErrorRecipes };
};

// Custom hook for fetching a recipe by ID
export const useRecipeById = (
  id: string,
  { enabled = true }: useQueryProps
) => {
  const {
    data: recipe,
    isLoading: isLoadingRecipe,
    refetch: refetchRecipe,
    error: errorRecipe,
    isError: isErrorRecipe,
  } = useQuery({
    queryKey: [RECIPES, id],
    queryFn: () => RecipeApi.fetchRecipeById(id),
    retry: 2,
    enabled,
  });

  return { recipe, refetchRecipe, isLoadingRecipe, errorRecipe, isErrorRecipe };
};

// Custom hook for creating a recipe
export const useCreateRecipe = () => {
  const mutation = useMutation<Recipe, Error, NewRecipe, unknown>({
    mutationFn: (newRecipe: NewRecipe) => RecipeApi.createRecipe(newRecipe),
  });

  if (mutation.error) {
    console.error("Error creating recipe:", mutation.error);
  }

  return {
    createRecipe: mutation.mutateAsync,
    isCreatingRecipe: mutation.isPending,
    createRecipeError: mutation.error,
    createData: mutation.data,
  };
};

// Custom hook for updating a recipe
export const useUpdateRecipe = () => {
  const mutation = useMutation<Recipe, Error, Recipe, unknown>({
    mutationFn: (updatedRecipe: Recipe) =>
      RecipeApi.updateRecipe(updatedRecipe),
  });

  return {
    updateRecipe: mutation.mutate,
    isUpdatingRecipe: mutation.isPending,
    updateRecipeError: mutation.error,
  };
};

// Custom hook for deleting a recipe
export const useDeleteRecipe = () => {
  const mutation = useMutation<Recipe, Error, string, unknown>({
    mutationFn: (id: string) => RecipeApi.deleteRecipe(id),
  });

  return {
    deleteRecipe: mutation.mutate,
    isDeletingRecipe: mutation.isPending,
    deleteRecipeError: mutation.error,
  };
};

// Custom hook for fetching recipes by creator ID
export const useRecipesByCreatorId = (
  creatorId: string,
  { enabled = true }: useQueryProps
) => {
  const errorMessage = ERROR_FETCHING_RECIPES;

  const {
    data: recipes,
    isLoading: isLoadingRecipes,
    refetch: refetchRecipes,
    error: errorRecipes,
    isError: isErrorRecipes,
  } = useQuery({
    queryKey: [RECIPES, "creator", creatorId],
    queryFn: () => RecipeApi.fetchRecipesByCreatorId(creatorId),
    retry: 0,
    enabled,
  });

  useDataFetching({
    isLoading: isLoadingRecipes,
    isError: isErrorRecipes,
    error: errorRecipes,
    errorMessage,
  });

  return { recipes, isLoadingRecipes, refetchRecipes, errorRecipes };
};

// Custom hook for searching recipes by title
export const useSearchRecipesByTitle = (
  title: string,
  { enabled = true }: useQueryProps
) => {
  const errorMessage = ERROR_FETCHING_RECIPES;

  const {
    data: recipes,
    isLoading: isLoadingRecipes,
    refetch: refetchRecipes,
    error: errorRecipes,
    isError: isErrorRecipes,
  } = useQuery({
    queryKey: [RECIPES, "search", title],
    queryFn: () => RecipeApi.fetchRecipesByTitle(title),
    retry: 0,
    enabled,
  });

  useDataFetching({
    isLoading: isLoadingRecipes,
    isError: isErrorRecipes,
    error: errorRecipes,
    errorMessage,
  });

  return { recipes, isLoadingRecipes, refetchRecipes, errorRecipes };
};
