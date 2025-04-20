"use client";

import {
  Dialog,
  DialogTrigger,
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

export function FollowingPopup() {
  const selectedUser = useSocialStore((state) => state.selectedUser);
  const setSelectedUser = useSocialStore((state) => state.setSelectedUser);
  const isFollowerPopupOpen = useSocialStore(
    (state) => state.isFollowerPopupOpen
  );
  const setIsFollowerPopupOpen = useSocialStore(
    (state) => state.setIsFollowerPopupOpen
  );

  const recipes = selectedUser?.savedItems.recipes || [];
  const following = selectedUser?.following || [];

  const router = useRouter();
  return (
    <Dialog
      open={isFollowerPopupOpen}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedUser(null);
          setIsFollowerPopupOpen(false);
          router.back();
        }
      }}
    >
      {/* Hides the default close button */}
      <DialogContent className="max-w-2xl [&>button:last-child]:hidden">
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
                  recipes.map((r) => (
                    <li key={r._id.toString()}>
                      {r.title ?? "Untitled Recipe"}
                    </li>
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
                  following.map((f) => (
                    <li key={f._id.toString()}>{f.username}</li>
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
