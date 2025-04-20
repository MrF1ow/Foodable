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
import { useFetchUserById } from "@/server/hooks/userHooks";

interface FollowingPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FollowingPopup({ open, onOpenChange }: FollowingPopupProps) {
  const selectedUser = useSocialStore((state) => state.selectedUser);
  //   const userId = selectedUser?._id;
  //   const { user, isLoadingUser } = useFetchUserById({
  //     id: userId!,
  //     enabled: !!userId,
  //   });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{selectedUser?.username}&apos;s Profile</DialogTitle>
          <DialogDescription>Recipes and followed users.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 overflow-y-auto">
          <Card className="flex-[2]">
            <CardHeader>
              <CardTitle>Recipes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                <li>Example Recipe 1</li>
                <li>Example Recipe 2</li>
                <li>Example Recipe 3</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="flex-[1]">
            <CardHeader>
              <CardTitle>Following</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                <li>FollowedUser1</li>
                <li>FollowedUser2</li>
                <li>FollowedUser3</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
