import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/app/get-query-client";
import Recipes from "@/app/recipe/recipes";
import { SAVED_ITEMS } from "@/lib/constants/process";
import { RecipeApi } from "@/server/api/recipeApi";

export default async function RecipePage() {
  const queryClient = getQueryClient();

  // Prefetch recipes data
  await queryClient.prefetchQuery({
    queryKey: [SAVED_ITEMS],
    queryFn: () => RecipeApi.fetchAllRecipes(true),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Recipes />
    </HydrationBoundary>
  );
}
