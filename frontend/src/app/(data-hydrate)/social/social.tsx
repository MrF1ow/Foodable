"use client";

// **Utility Imports**
import { filterUsers, filterSavedItems } from "@/lib/utils/listItems";

import {
  UserFollowSection,
  UserSavedSection,
} from "@/components/page-specific/social/SocialPageDataSections";
import { useSocialStore } from "@/stores/social/store";
import SavedDataFetcher from "@/components/data-fetchers/SavedDataFetcher";
import GroceryListDataFetcher from "@/components/data-fetchers/GroceryDataFetcher";
import SocialDataFetcher from "@/components/data-fetchers/SocialDataFetcher";
import { useAllSavedItems } from "@/server/hooks/savedItemsHooks";
import { useUserStore } from "@/stores/user/store";
import { useFetchAllFollowersOfUser, useFetchAllFollowingOfUser } from "@/server/hooks/userHooks";
import { SavedGroceryMetaData, SavedRecipeMetaData } from "@/types/saved";
import { useEffect, useState } from "react";
import { FollowMetadata } from "@/types/user";
import LocationDataFetcher from "@/components/data-fetchers/LocationDataFetcher";

export default function Social() {
  const itemSearchQuery = useSocialStore((state) => state.savedItemsQuery);
  const userSearchQuery = useSocialStore((state) => state.userQuery);

  const [filteredFollowers, setFilteredFollowers] = useState<FollowMetadata[]>([])
  const [filteredFollowing, setFilteredFollowing] = useState<FollowMetadata[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<SavedRecipeMetaData[]>([])
  const [filteredGroceryLists, setFilteredGroceryLists] = useState<SavedGroceryMetaData[]>([])

  const isUser = useUserStore((state) => state.isUser);
  if (!isUser) {
    return null;
  }

  const { savedItems, refetchSavedItems } = useAllSavedItems({
    enabled: isUser,
  });

  const { following, refetchFollowing } = useFetchAllFollowingOfUser({
    enabled: isUser,
  })

  const { followers, refetchFollowers } = useFetchAllFollowersOfUser({
    enabled: isUser
  })

  useEffect(() => {
    refetchSavedItems().then((response) => {
      if (response.data) {
        const recipes = filterSavedItems(savedItems.recipes, itemSearchQuery) as SavedRecipeMetaData[];
        const lists = filterSavedItems(savedItems.groceryLists, itemSearchQuery) as SavedGroceryMetaData[];
        setFilteredRecipes(recipes);
        setFilteredGroceryLists(lists);
      }
    })

  }, [savedItems])

  useEffect(() => {

    refetchFollowing().then((response) => {
      if (response.data) {
        const following = filterUsers(response.data, userSearchQuery);
        setFilteredFollowing(following)
      }
    })
  }, [following])

  useEffect(() => {
    refetchFollowers().then((response) => {
      if (response.data) {
        const followers = filterUsers(response.data, userSearchQuery);
        setFilteredFollowers(followers)
      }
    })

  }, [followers])

  return (
    <>
      <LocationDataFetcher />
      <SocialDataFetcher />
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
