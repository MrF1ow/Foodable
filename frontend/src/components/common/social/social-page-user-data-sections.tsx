"use client";

import { FollowMetadata } from "@/types/user";
import { SocialPageFollowingHeader } from "./social-page-headers";
import RecipeSearchBar from "@/components/common/recipe/recipe-search-bar";
import SocialSectionLayout from "@/layouts/common/social/social-section-layout";
import SocialItem from "./social-section-item";
import { RecipeMetaData } from "@/types/saved";
import { useUserStore } from "@/stores/user/store";
import {
  useDeleteFollowing,
  useFetchAllFollowingOfUser,
} from "@/server/hooks/userHooks";
import { FaHeart } from "react-icons/fa";

interface UserFollowSectionProps {
  following: FollowMetadata[];
  followers: FollowMetadata[];
}

interface UserRecipesSectionProps {
  recipes: RecipeMetaData[];
}

export const UserFollowSection = ({
  following,
  followers,
}: UserFollowSectionProps) => {
  const selectedUserSection = useUserStore(
    (state) => state.selectedUserSection
  );
  const currentItemId = useUserStore((state) => state.currentItemId);
  const setCurrentId = useUserStore((state) => state.setCurrentItemId);

  const { refetchFollowing } = useFetchAllFollowingOfUser({
    enabled: true,
  });

  const { deleteFollowing } = useDeleteFollowing(currentItemId || "");

  const handleDeleteFollowing = async () => {
    if (!currentItemId) return;
    setCurrentId(currentItemId);
    deleteFollowing(currentItemId);
    await refetchFollowing();
  };

  return (
    <SocialSectionLayout headerComponent={<SocialPageFollowingHeader />}>
      {selectedUserSection === "followers" && (
        <div>
          {followers.length === 0 && (
            <div className="text-center text-lg text-foreground italic">
              No followers
            </div>
          )}
          {followers.map((follower) => (
            <SocialItem
              key={follower.userId}
              title={follower.username}
              imageId={follower.avatarImageId.toString()}
              icon={<FaHeart />}
              handleRemove={handleDeleteFollowing}
            />
          ))}
        </div>
      )}
      {selectedUserSection === "following" && (
        <div>
          {following.length === 0 && (
            <div className="text-center text-lg text-foreground italic">
              Not following anyone
            </div>
          )}
          {following.map((follow) => (
            <SocialItem
              key={follow.userId}
              title={follow.username}
              imageId={follow.avatarImageId.toString()}
            />
          ))}
        </div>
      )}
    </SocialSectionLayout>
  );
};

export const UserRecipesSection = ({ recipes }: UserRecipesSectionProps) => {
  return (
    <SocialSectionLayout headerComponent={<RecipeSearchBar />}>
      <div>
        {recipes.map((recipe) => (
          <SocialItem
            key={recipe._id.toString()}
            title={recipe.title}
            imageId={recipe.imageId.toString()}
          />
        ))}
      </div>
    </SocialSectionLayout>
  );
};
