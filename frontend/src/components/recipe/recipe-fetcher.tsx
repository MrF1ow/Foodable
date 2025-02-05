import { useEffect } from "react";
import { useAllRecipes } from "@/server/hooks/recipeHooks";
import { useRecipeStore } from "@/stores/recipe/store";
import { Recipe } from "@/types/recipe";

export const RecipesFetcher = () => {
  // Use useAllRecipes to fetch recipes
  const {
    recipes: fetchedRecipes,
    isLoadingRecipes,
    errorRecipes,
  } = useAllRecipes({ enabled: true });

  const setCurrentRecipes = useRecipeStore((state) => state.setCurrentRecipes);
  const setFilterRecipes = useRecipeStore((state) => state.setFilteredRecipes);
  const currentRecipes = useRecipeStore((state) => state.currentRecipes);

  useEffect(() => {
    // Only update the store if the fetched recipes are different from the current ones
    if (fetchedRecipes && fetchedRecipes.length > 0) {
      const isDifferent =
        !currentRecipes.length ||
        fetchedRecipes.some(
          (recipe: Recipe, index: number) =>
            recipe._id !== currentRecipes[index]?._id
        );

      if (isDifferent) {
        setCurrentRecipes(fetchedRecipes.slice(0, 100)); // Limit to 100 recipes
        if (!currentRecipes.length) {
          setFilterRecipes(fetchedRecipes.slice(0, 100));
        }
      }
    }
  }, [fetchedRecipes, currentRecipes, setCurrentRecipes]);

  if (isLoadingRecipes) return <p>Loading recipes...</p>;
  if (errorRecipes) return <p>Error loading recipes: {errorRecipes.message}</p>;

  return null;
};
