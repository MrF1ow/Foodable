"use client";

import { useGeneralStore } from "@/stores/general/store";
import PortalInjector from "../PortalInjector";
import { FORM_NAMES } from "@/lib/constants/forms";
import SideList from "@/components/side-list/SideList";
import RecipePopUp from "@/components/popups/RecipePopup";
import AddItem from "@/components/forms/AddItem";
import { useRouter } from "next/navigation";
import UserPopup from "@/components/popups/UserPopup";
import PreferenceForm from "../forms/PreferenceForm";

export default function SocialPageInjections() {
  const currentForm = useGeneralStore((state) => state.currentMainPortalForm);
  const setForm = useGeneralStore((state) => state.setCurrentMainPortalForm);
  const setShowMainPortal = useGeneralStore((state) => state.setShowMainPortal);

  const router = useRouter();

  const additionalBackButtonClick = () => {
    setShowMainPortal(false);
    router.push("/social");
  };

  const handleAddItemClose = () => {
    setForm(FORM_NAMES.GROCERY_LIST);
  };

  const handleRecipeItemClick = (id: string) => {
    setForm(FORM_NAMES.RECIPE);
    router.push(`/social/recipe/${id}`);
  };

  const handleFollowItemClick = (id: string) => {
    setForm(FORM_NAMES.FOLLOWER_POPUP);
    router.push(`/social/user/${id}`);
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

  const userPopup = (
    <UserPopup
      additionalBackButtonClick={additionalBackButtonClick}
      className="lg:max-w-[45%] lg:max-h-[80%] md:max-w-[60%] md:max-h-[85%]"
      handleFollowItemClick={handleFollowItemClick}
      handleRecipeItemClick={handleRecipeItemClick}
    />
  );

  const addItemForm = (
    <AddItem
      className="lg:max-w-[35%] lg:max-h-[80%] md:max-w-[60%] md:max-h-[85%]"
      handleClose={handleAddItemClose}
      setCurrentForm={setForm}
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
          componentToInject={userPopup}
          changeShowMainPortal={true}
        />
      )}
      {currentForm === FORM_NAMES.ADD_ITEM_TO_LIST && (
        <PortalInjector
          containerId="main-modal-portal"
          componentToInject={addItemForm}
        />
      )}
    </>
  );
}
