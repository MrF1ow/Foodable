import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient } from "@/app/get-query-client";
import {
  GROCERY_LISTS,
  RECIPES,
  SAVED_CATEGORIES,
  SAVED_ITEMS,
} from "@/lib/constants/process";
import { GroceryApi } from "@/server/api/groceryListApi";
import { RecipeApi } from "@/server/api/recipeApi";
import { SavedItemsApi } from "@/server/api/savedItemsApi";
import { checkRole } from "@/utils/roles";

export default async function FetchUserData() {
  const queryClient = getQueryClient();

  const isUser = await checkRole("user");

  // only fetch user data if user is logged in
  if (isUser) {
    // Prefetch recipes data
    await queryClient.prefetchQuery({
      queryKey: [GROCERY_LISTS],
      queryFn: () => GroceryApi.fetchAllGroceryLists(true),
    });

    // Prefetch saved items data
    await queryClient.prefetchQuery({
      queryKey: [SAVED_ITEMS],
      queryFn: () => SavedItemsApi.getAllSavedItems(),
    });

    await queryClient.prefetchQuery({
      queryKey: [SAVED_CATEGORIES],
      queryFn: () => SavedItemsApi.getAllSavedCategories(),
    });
  }

  // Prefetch recipes data
  await queryClient.prefetchQuery({
    queryKey: [RECIPES],
    queryFn: () => RecipeApi.fetchAllRecipes(true),
  });

  return queryClient;
}
