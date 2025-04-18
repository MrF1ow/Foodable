"use client";

// **Package Imports**
import { useEffect, useState } from "react";

// **Store Imports**
import { useUserStore } from "@/stores/user/store";
import { useRecipeStore } from "@/stores/recipe/store";

// **Hook Imports**
import {
  useFetchAllFollowersOfUser,
  useFetchAllFollowingOfUser,
} from "@/server/hooks/userHooks";
import { useAllSavedItems } from "@/server/hooks/savedItemsHooks";

// **Utility Imports**
import { filterUsers, filterRecipes } from "@/lib/utils/listItems";

// **Type Imports**
import { RecipeMetaData } from "@/types/saved";

// **Component Imports**
import SavedDataFetcher from "@/components/data-fetchers/SavedDataFetcher";
import {
  UserFollowSection,
  UserRecipesSection,
} from "@/components/page-specific/social/SocialPageDataSections";

export default function Social() {
  const searchQuery = useUserStore((state) => state.searchQuery);
  const filter = useRecipeStore((state) => state.filter);

  const [savedRecipes, setSavedRecipes] = useState<RecipeMetaData[]>([]);

  const { savedItems } = useAllSavedItems({
    enabled: true,
  });

  const { followers } = useFetchAllFollowersOfUser({
    enabled: true,
  });

  const { following } = useFetchAllFollowingOfUser({
    enabled: true,
  });

  useEffect(() => {
    if (savedItems) {
      setSavedRecipes(savedItems.recipes);
    }
  }, [savedItems]);

  const filteredFollowers = filterUsers(followers, searchQuery);
  const filteredFollowing = filterUsers(following, searchQuery);
  const filteredRecipes = filterRecipes(savedRecipes, filter);

  return (
    <>
      <SavedDataFetcher />
      <div className="w-full h-full flex flex-col lg:flex-row gap-x-0 gap-y-2 lg:gap-x-6 lg:gap-y-0">
        <UserFollowSection
          followers={filteredFollowers}
          following={filteredFollowing}
        />
        <UserRecipesSection recipes={filteredRecipes} />
      </div>
    </>
  );
}
