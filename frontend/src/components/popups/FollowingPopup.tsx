"use client";

import { useSocialStore } from "@/stores/social/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { FORM_NAMES } from "@/lib/constants/forms";
import { useGeneralStore } from "@/stores/general/store";
import { JSX } from "react";
import { FollowPopupHeader, FollowPopupRecipeSection, FollowPopupFollowerSection } from "../page-specific/social/FollowPopupParts";

interface FollowerPopUpProps {
  className?: string;
  additionalBackButtonClick?: () => void;
}

export default function FollowingPopup({
  className,
  additionalBackButtonClick,
}: FollowerPopUpProps): JSX.Element {
  const selectedUser = useSocialStore((state) => state.selectedUser);
  const setSelectedUser = useSocialStore((state) => state.setSelectedUser);
  const setCurrentForm = useGeneralStore((state) => state.setCurrentForm);
  const currentForm = useGeneralStore((state) => state.currentForm);

  const handleItemClick = (id: string) => {
    setCurrentForm(FORM_NAMES.RECIPE);
    router.replace(`/social/recipe/${id}`);
  };

  const handleClose = () => {
    setCurrentForm(null);
    additionalBackButtonClick?.()
    router.back()
  }

  const router = useRouter();

  return (
    <Card className={`z-[50] w-full h-full bg-card-background overflow-hidden overflow-y-scroll rounded-none shadow-none md:rounded-xl md:shadow-xl lg:rounded-xl lg:shadow-xl xl:rounded-xl xl:shadow-xl gap-2 ${className}`}>
      <CardHeader className="w-full h-[40%]">
        <FollowPopupHeader handleClose={handleClose} />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <FollowPopupFollowerSection />
        <FollowPopupRecipeSection />
      </CardContent>
    </Card>
  );
}
