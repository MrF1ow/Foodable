import { useEffect } from "react";
import { useFetchImageById } from "@/server/hooks/imageHooks";
import { useFetchRecipes } from "@/server/hooks/recipeHooks";
import { useRecipeStore } from "@/stores/recipe/store";

export const RecipesFetcher = () => {
  const { data: fetchedRecipes, isLoading, error } = useFetchRecipes();
  const setCurrentRecipes = useRecipeStore((state) => state.setCurrentRecipes);

  useEffect(() => {
    if (fetchedRecipes) {
      setCurrentRecipes(fetchedRecipes.slice(0, 100)); // Limit to 100 recipes
    }
  }, [fetchedRecipes, setCurrentRecipes]);

  if (isLoading) return <p>Loading recipes...</p>;
  if (error) return <p>Error loading recipes: {error.message}</p>;

  return null;
};
