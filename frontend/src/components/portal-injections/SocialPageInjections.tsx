"use client";

import { useGeneralStore } from "@/stores/general/store";
import PortalInjector from "../PortalInjector";
import { FORM_NAMES } from "@/lib/constants/forms";
import SideList from "@/components/side-list/SideList";
import RecipePopUp from "@/components/popups/RecipePopup";
import { useRouter } from "next/navigation";
import { FollowingPopup } from "@/components/page-specific/social/SocialFollowerPopup";

export default function RecipePageInjections() {
  const currentForm = useGeneralStore((state) => state.currentForm);
  const setShowMainPortal = useGeneralStore((state) => state.setShowMainPortal);

  const router = useRouter();

  const additionalBackButtonClick = () => {
    setShowMainPortal(false);
    router.back();
  };

  const sideList = (
    <SideList
      isUser={true}
      additionalBackButtonClick={additionalBackButtonClick}
      className="lg:max-w-[35%] lg:max-h-[80%] md:max-w-[60%] md:max-h-[85%]"
    />
  );

  const recipeForm = (
    <RecipePopUp
      additionalBackButtonClick={additionalBackButtonClick}
      className="lg:max-w-[45%] lg:max-h-[80%] md:max-w-[60%] md:max-h-[85%]"
    />
  );

  const followerPopop = (
    <FollowingPopup
      additionalBackButtonClick={additionalBackButtonClick}
      className="lg:max-w-[45%] lg:max-h-[80%] md:max-w-[60%] md:max-h-[85%]"
    />
  );

  return (
    <>
      {currentForm === FORM_NAMES.RECIPE && (
        <PortalInjector
          containerId="main-modal-portal"
          componentToInject={recipeForm}
          changeShowMainPortal={true}
        />
      )}
      {currentForm === FORM_NAMES.GROCERY_LIST && (
        <PortalInjector
          containerId="main-modal-portal"
          componentToInject={sideList}
          changeShowMainPortal={true}
        />
      )}
      {currentForm === FORM_NAMES.FOLLOWER_POPUP && (
        <PortalInjector
          containerId="main-modal-portal"
          componentToInject={followerPopop}
          changeShowMainPortal={true}
        />
      )}
    </>
  );
}
