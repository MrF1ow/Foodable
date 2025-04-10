import { createServerQueryClient } from "@/app/get-query-client";
import {
  GROCERY_LISTS,
  RECIPES,
  SAVED_CATEGORIES,
  SAVED_ITEMS,
  USERS,
  FOLLOWERS,
  FOLLOWING,
  SETTINGS,
  PREFERENCES,
  CURRENT_LIST,
} from "@/lib/constants/process";
import { GroceryApi } from "@/server/api/groceryListApi";
import { RecipeApi } from "@/server/api/recipeApi";
import { UserApi } from "@/server/api/userApi";
import { SavedItemsApi } from "@/server/api/savedItemsApi";
import { checkRole } from "@/utils/roles";
import { dehydrate } from "@tanstack/react-query";

export default async function FetchUserData() {
  const queryClient = createServerQueryClient();

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

    // Prefetch saved categories data
    await queryClient.prefetchQuery({
      queryKey: [SAVED_CATEGORIES],
      queryFn: () => SavedItemsApi.getAllSavedCategories(),
    });

    // Prefetch user data
    await queryClient.prefetchQuery({
      queryKey: [USERS, CURRENT_LIST],
      queryFn: () => UserApi.fetchUserCurrentList(),
    });

    await queryClient.prefetchQuery({
      queryKey: [USERS, FOLLOWERS],
      queryFn: () => UserApi.fetchAllFollowersOfUser(),
    });

    await queryClient.prefetchQuery({
      queryKey: [USERS, FOLLOWING],
      queryFn: () => UserApi.fetchAllFollowingOfUser(),
    });

    await queryClient.prefetchQuery({
      queryKey: [USERS, SETTINGS],
      queryFn: () => UserApi.fetchUserSettings(),
    });

    await queryClient.prefetchQuery({
      queryKey: [USERS, PREFERENCES],
      queryFn: () => UserApi.fetchUserPreferences(),
    });
  }

  // Prefetch recipes data
  await queryClient.prefetchQuery({
    queryKey: [RECIPES],
    queryFn: () => RecipeApi.fetchAllRecipes(true),
  });

  return dehydrate(queryClient);
}
