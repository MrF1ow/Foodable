"use client";

// **Utility Imports**
import { filterUsers, filterSavedItems } from "@/lib/utils/listItems";

import {
  UserFollowSection,
  UserSavedSection,
} from "@/components/page-specific/social/SocialPageDataSections";
import { useSocialStore } from "@/stores/social/store";
import { useAllSavedItems } from "@/server/hooks/savedItemsHooks";
import { useUserStore } from "@/stores/user/store";
import { useFetchAllFollowersOfUser, useFetchAllFollowingOfUser } from "@/server/hooks/userHooks";
import { SavedGroceryMetaData, SavedRecipeMetaData } from "@/types/saved";

export default function Social() {
  const itemSearchQuery = useSocialStore((state) => state.savedItemsQuery);
  const userSearchQuery = useSocialStore((state) => state.userQuery);
  const isUser = useUserStore((state) => state.isUser);
  if (!isUser) {
    return null;
  }

  const { savedItems } = useAllSavedItems({
    enabled: isUser,
  });

  const { following } = useFetchAllFollowingOfUser({
    enabled: isUser,
  })

  const { followers } = useFetchAllFollowersOfUser({
    enabled: isUser
  })

  const filteredFollowers = filterUsers(followers, userSearchQuery);
  const filteredFollowing = filterUsers(following, userSearchQuery);
  const filteredRecipes = filterSavedItems(savedItems.recipes, itemSearchQuery) as SavedRecipeMetaData[];
  const filteredGroceryLists = filterSavedItems(savedItems.groceryLists, itemSearchQuery) as SavedGroceryMetaData[];

  return (
    <>
      <div className="w-full h-full flex flex-col lg:flex-row gap-x-0 gap-y-2 lg:gap-x-6 lg:gap-y-0">
        <UserFollowSection
          followers={filteredFollowers}
          following={filteredFollowing}
        />
        <UserSavedSection recipes={filteredRecipes} groceryLists={filteredGroceryLists} />
      </div>
    </>
  );
}
