"use client";

import { FollowMetadata } from "@/types/user";
import {
  SocialPageFollowingHeader,
  SocialPageSavedHeader,
} from "./SocialPageHeader";
import SaveItemSearchBar from "../saved/SaveItemSearchBar";
import SocialSectionLayout from "@/layouts/page-specific/social/SocialSectionLayout";
import SocialItem from "./SocialSectionSectionItems";
import {
  RecipeMetaData,
  SavedGroceryMetaData,
  SavedRecipeMetaData,
} from "@/types/saved";
import { useSocialStore } from "@/stores/social/store";
import {
  useDeleteFollowing,
  useFetchAllFollowingOfUser,
  useUpdateUserCurrentList,
} from "@/server/hooks/userHooks";
import { FaHeart } from "react-icons/fa";
import { IoBookmark } from "react-icons/io5";
import { useState } from "react";
import {
  useAllSavedItems,
  useDeleteSavedItem,
} from "@/server/hooks/savedItemsHooks";
import { useRouter } from "next/navigation";
import { useGeneralStore } from "@/stores/general/store";
import { FORM_NAMES } from "@/lib/constants/forms";
import { SavedSections } from "@/types";
import { createToMutate } from "@/lib/utils/listItems";
import { useGroceryStore } from "@/stores/grocery/store";
import { GroceryItem, GroceryList } from "@/types/grocery";

interface UserFollowSectionProps {
  following: FollowMetadata[];
  followers: FollowMetadata[];
}

interface UserRecipesSectionProps {
  recipes: SavedRecipeMetaData[];
  groceryLists: SavedGroceryMetaData[];
}

export const UserFollowSection = ({
  following,
  followers,
}: UserFollowSectionProps) => {
  const selectedUserSection = useSocialStore(
    (state) => state.currentFollowSection
  );

  const setSelectedUser = useSocialStore((state) => state.setSelectedUser);
  const [open, setOpen] = useState(false);

  const { refetchFollowing } = useFetchAllFollowingOfUser({
    enabled: true,
  });
  const setCurrentForm = useGeneralStore((state) => state.setCurrentForm);

  const { deleteFollowing } = useDeleteFollowing();

  const handleDeleteFollowing = async (id: string) => {
    if (!id) return;
    deleteFollowing(id);
    await refetchFollowing();
  };

  const router = useRouter();

  const handleFollowerClick = (id: string) => {
    setCurrentForm(FORM_NAMES.FOLLOWER_POPUP);
    router.push(`social/user/${id}`);
  };

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
              handleClick={() => handleFollowerClick(follower._id.toString())}
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
              Icon={FaHeart}
              handleRemove={() => handleDeleteFollowing(follow._id.toString())}
              handleClick={() => handleFollowerClick(follow._id.toString())}
            />
          ))}
        </div>
      )}
    </SocialSectionLayout>
  );
};

export const UserSavedSection = ({
  recipes,
  groceryLists,
}: UserRecipesSectionProps) => {
  const selectedSection = useSocialStore((state) => state.currentSavedSection);
  const setCurrentForm = useGeneralStore((state) => state.setCurrentForm);

  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const { updateUserCurrentList } = useUpdateUserCurrentList();

  const { refetchSavedItems } = useAllSavedItems({
    enabled: true,
  });
  const { deleteSavedItem } = useDeleteSavedItem();

  const router = useRouter();

  const handleGroceryClick = async (data: SavedGroceryMetaData) => {
    const { category, type, ...rest } = data;
    const newList = {
      ...rest,
      items: [] as GroceryItem[],
    };
    await updateUserCurrentList(newList._id.toString());
    setCurrentList(newList as GroceryList);
  };

  const handleItemClick = async (id: string, type: SavedSections, data: SavedGroceryMetaData | SavedRecipeMetaData) => {
    if (type === "recipes") {
      setCurrentForm(FORM_NAMES.RECIPE);
      router.push(`social/recipe/${id}`);
    } else if (type === "groceryLists") {
      setCurrentForm(FORM_NAMES.GROCERY_LIST);
      await handleGroceryClick(data as SavedGroceryMetaData);
      router.push(`social/grocery/${id}`);
    }
  };

  const handleRemoveItem = async (
    data: SavedRecipeMetaData | SavedGroceryMetaData
  ) => {
    deleteSavedItem(data);
    await refetchSavedItems();
  };

  return (
    <SocialSectionLayout headerComponent={<SocialPageSavedHeader />}>
      <div className="w-full h-full">
        {selectedSection === "recipes" && (
          <>
            {recipes.length === 0 && (
              <div className="text-center text-lg text-foreground italic">
                No Saved Recipes
              </div>
            )}
            {recipes.map((recipe) => (
              <SocialItem
                key={recipe._id.toString()}
                title={recipe.title}
                imageId={recipe.imageId ? recipe.imageId.toString() : null}
                Icon={IoBookmark}
                handleClick={() =>
                  handleItemClick(recipe._id.toString(), "recipes", recipe)
                }
                handleRemove={() => handleRemoveItem(recipe)}
              />
            ))}
          </>
        )}

        {selectedSection === "groceryLists" && (
          <>
            {groceryLists.length === 0 && (
              <div className="text-center text-lg text-foreground italic">
                No Saved Grocery Lists
              </div>
            )}
            {groceryLists.map((groceryList) => (
              <SocialItem
                key={groceryList._id.toString()}
                title={groceryList.title}
                Icon={IoBookmark}
                handleClick={() =>
                  handleItemClick(groceryList._id.toString(), "groceryLists", groceryList)
                }
                handleRemove={() => handleRemoveItem(groceryList)}
              />
            ))}
          </>
        )}
      </div>
    </SocialSectionLayout>
  );
};
