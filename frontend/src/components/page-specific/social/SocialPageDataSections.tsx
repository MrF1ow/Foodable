"use client";

import { FollowMetadata } from "@/types/user";
import { SocialPageFollowingHeader, SocialPageSavedHeader } from "./SocialPageHeader";
import SaveItemSearchBar from "../saved/SaveItemSearchBar";
import SocialSectionLayout from "@/layouts/page-specific/social/SocialSectionLayout";
import SocialItem from "./SocialSectionSectionItems";
import { RecipeMetaData, SavedGroceryMetaData } from "@/types/saved";
import { useSocialStore } from "@/stores/social/store";
import {
  useDeleteFollowing,
  useFetchAllFollowingOfUser,
} from "@/server/hooks/userHooks";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";
import { useAllSavedItems } from "@/server/hooks/savedItemsHooks";
import { useRouter } from "next/navigation";
import { useGeneralStore } from "@/stores/general/store";
import { FORM_NAMES } from "@/lib/constants/forms";
import { SavedSections } from "@/types";

interface UserFollowSectionProps {
  following: FollowMetadata[];
  followers: FollowMetadata[];
}

interface UserRecipesSectionProps {
  recipes: RecipeMetaData[];
  groceryLists: SavedGroceryMetaData[];
}

export const UserFollowSection = ({
  following,
  followers,
}: UserFollowSectionProps) => {
  const selectedUserSection = useSocialStore((state) => state.currentFollowSection);

  const { refetchFollowing } = useFetchAllFollowingOfUser({
    enabled: true,
  });

  const { deleteFollowing } = useDeleteFollowing();

  const handleDeleteFollowing = async (id: string) => {
    if (!id) return;
    deleteFollowing(id);
    await refetchFollowing();
  };

  const router = useRouter();

  return (
    <SocialSectionLayout headerComponent={<SocialPageFollowingHeader />}>
      {selectedUserSection === "followers" && (
        <div className="w-full h-full">
          {followers.length === 0 && (
            <div className="text-center text-lg text-foreground italic">
              No followers
            </div>
          )}
          {followers.map((follower) => (
            <SocialItem
              key={follower._id}
              title={follower.username}
              icon={<FaHeart />}
              handleRemove={() => handleDeleteFollowing(follower._id.toString())}
              handleClick={() => router.push(`social/user/${follower._id.toString()}`)}
            />
          ))}
        </div>
      )}
      {selectedUserSection === "following" && (
        <div className="w-full h-full">
          {following.length === 0 && (
            <div className="text-center text-lg text-foreground italic">
              Not following anyone
            </div>
          )}
          {following.map((follow) => (
            <SocialItem
              key={follow._id}
              title={follow.username}
              handleClick={() => router.push(`social/user/${follow._id.toString()}`)}
            />
          ))}
        </div>
      )}
    </SocialSectionLayout>
  );
};

export const UserSavedSection = ({ recipes, groceryLists }: UserRecipesSectionProps) => {
  const selectedSection = useSocialStore((state) => state.currentSavedSection);
  const setCurrentForm = useGeneralStore((state) => state.setCurrentForm)

  const { refetchSavedItems } = useAllSavedItems({
    enabled: true
  })

  const router = useRouter();

  const handleItemClick = (id: string, type: SavedSections) => {
    if (type === "recipes") {
      setCurrentForm(FORM_NAMES.RECIPE)
      router.push(`social/recipe/${id}`);
    } else if (type === "groceryLists") {
      setCurrentForm(FORM_NAMES.GROCERY_LIST);
      router.push(`social/grocery/${id}`);

    }
  }

  return (
    <SocialSectionLayout headerComponent={<SocialPageSavedHeader />}>
      <div className="w-full h-full">
        {selectedSection === "recipes" && (
          <>
            {recipes.map((recipe) => (
              <SocialItem
                key={recipe._id.toString()}
                title={recipe.title}
                imageId={recipe.imageId.toString()}
                handleClick={() => handleItemClick(recipe._id.toString(), "recipes")}
              />
            ))}
          </>
        )}
        {selectedSection === "groceryLists" && (
          <>
            {groceryLists.map((groceryList) => (
              <SocialItem
                key={groceryList._id.toString()}
                title={groceryList.title}
                handleClick={() => handleItemClick(groceryList._id.toString(), "groceryLists")}
              />
            ))}
          </>
        )}
      </div>
    </SocialSectionLayout>
  );
};
