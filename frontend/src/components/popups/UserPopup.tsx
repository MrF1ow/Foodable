"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGeneralStore } from "@/stores/general/store";
import { JSX } from "react";
import { UserPopupHeader, UserPopupRecipeSection, UserPopupFollowerSection } from "../page-specific/social/UserPopupParts";

interface UserPopupProps {
  className?: string;
  additionalBackButtonClick?: () => void;
  handleFollowItemClick: (id: string) => void;
  handleRecipeItemClick: (id: string) => void;
}

export default function UserPopup({
  className,
  additionalBackButtonClick,
  handleFollowItemClick,
  handleRecipeItemClick
}: UserPopupProps): JSX.Element {
  const setCurrentForm = useGeneralStore((state) => state.setCurrentMainPortalForm);

  const handleClose = () => {
    setCurrentForm(null);
    additionalBackButtonClick?.()
  }

  return (
    <Card className={`z-[50] w-full h-full bg-card-background overflow-hidden overflow-y-scroll rounded-none shadow-none md:rounded-xl md:shadow-xl lg:rounded-xl lg:shadow-xl xl:rounded-xl xl:shadow-xl gap-2 ${className}`}>
      <CardHeader className="w-full h-[40%]">
        <UserPopupHeader handleClose={handleClose} />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <UserPopupFollowerSection handleItemClick={handleFollowItemClick} />
        <UserPopupRecipeSection handleItemClick={handleRecipeItemClick} />
      </CardContent>
    </Card>
  );
}
