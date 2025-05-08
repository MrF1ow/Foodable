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
  IMAGES,
  SELF,
} from "@/lib/constants/process";
import { GroceryApi, RecipeApi, UserApi, SavedItemsApi } from "@/server/api";
import { checkRole } from "@/lib/utils/clerk-utils";
import { dehydrate } from "@tanstack/react-query";

type FetchDataOptions = {
  grocery?: boolean;
  recipes?: boolean;
  userData?: boolean;
  saved?: boolean;
};

export default async function FetchData(options: FetchDataOptions = {}) {
  const queryClient = createServerQueryClient();

  const isUser = await checkRole("user");

  if (isUser) {
    if (options?.grocery) {
      await queryClient.prefetchQuery({
        queryKey: [GROCERY_LISTS],
        queryFn: () => GroceryApi.fetchAllGroceryLists(true),
      });
      await queryClient.prefetchQuery({
        queryKey: [USERS, CURRENT_LIST],
        queryFn: () => UserApi.fetchUserCurrentList(),
      });
    }
    if (options?.saved) {
      await queryClient.prefetchQuery({
        queryKey: [SAVED_ITEMS],
        queryFn: () => SavedItemsApi.getAllSavedItems(),
      });

      await queryClient.prefetchQuery({
        queryKey: [SAVED_CATEGORIES],
        queryFn: () => SavedItemsApi.getAllSavedCategories(),
      });
    }

    if (options?.userData) {

      await queryClient.prefetchQuery({
        queryKey: [USERS, IMAGES],
        queryFn: () => UserApi.fetchSignInUserBannerId(),
      });

      await queryClient.prefetchQuery({
        queryKey: [USERS, SELF],
        queryFn: () => UserApi.fetchSelf()
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
  }

  if (options?.recipes) {
    await queryClient.prefetchQuery({
      queryKey: [RECIPES],
      queryFn: () => RecipeApi.fetchAllRecipes(true),
    });
  }

  return dehydrate(queryClient);
}
