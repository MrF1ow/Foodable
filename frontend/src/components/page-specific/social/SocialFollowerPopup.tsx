"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSocialStore } from "@/stores/social/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FORM_NAMES } from "@/lib/constants/forms";
import { SavedSections } from "@/types";
import { useGeneralStore } from "@/stores/general/store";
import SocialItem from "./SocialSectionSectionItems";
import { IoBookmark } from "react-icons/io5";
import Spinner from "@/components/Spinner";
import { JSX } from "react";

interface FollowerPopUpProps {
  className?: string;
  additionalBackButtonClick?: () => void;
}

export function FollowingPopup({
  className,
  additionalBackButtonClick,
}: FollowerPopUpProps): JSX.Element {
  const selectedUser = useSocialStore((state) => state.selectedUser);
  const setSelectedUser = useSocialStore((state) => state.setSelectedUser);
  const isFollowerPopupOpen = useSocialStore(
    (state) => state.isFollowerPopupOpen
  );
  const setIsFollowerPopupOpen = useSocialStore(
    (state) => state.setIsFollowerPopupOpen
  );
  const setCurrentForm = useGeneralStore((state) => state.setCurrentForm);

  const recipes = selectedUser?.savedItems.recipes || [];
  const following = selectedUser?.following || [];

  const handleItemClick = (id: string) => {
    setCurrentForm(FORM_NAMES.RECIPE);
    setIsFollowerPopupOpen(false);
    router.replace(`/social/recipe/${id}`);
  };

  const router = useRouter();

  return (
    <Dialog
      open={isFollowerPopupOpen}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedUser(null);
          additionalBackButtonClick?.();
          setIsFollowerPopupOpen(false);
        }
      }}
    >
      {/* Hides the default close button */}
      <DialogContent
        className={`z-[99999] [&>button:last-child]:hidden ${className}`}
      >
        <DialogHeader>
          <DialogTitle>{selectedUser?.username}&apos;s Profile</DialogTitle>
          <DialogDescription>Recipes and followed users.</DialogDescription>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="absolute right-4 top-4 "
              aria-label="Close"
              onClick={() => setIsFollowerPopupOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="flex gap-4 overflow-y-auto">
          <Card className="flex-[2]">
            <CardHeader>
              <CardTitle>Recipes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recipes.length === 0 ? (
                  <li className="text-muted-foreground">No recipes saved.</li>
                ) : (
                  recipes.map((recipe) => (
                    <SocialItem
                      key={recipe._id.toString()}
                      title={recipe.title}
                      imageId={recipe.imageId.toString()}
                      Icon={IoBookmark}
                      handleClick={() => handleItemClick(recipe._id.toString())}
                    />
                  ))
                )}
              </ul>
            </CardContent>
          </Card>

          <Card className="flex-[1]">
            <CardHeader>
              <CardTitle>Following</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {following.length === 0 ? (
                  <li className="text-muted-foreground">
                    Not following anyone.
                  </li>
                ) : (
                  following.map((follower) => (
                    <li key={follower._id.toString()}>{follower.username}</li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
