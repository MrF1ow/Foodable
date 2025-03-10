"use client";

// Local Imports
import { useGeneralStore } from "@/stores/general/store";
import { RecipePopUp } from "../recipe/recipe-popup";
import { SideList } from "../side-list";
import { useSavedItemsStore } from "@/stores/saved/store";

export const SavedItemPopup = () => {
  const splitLayout = useGeneralStore((state) => state.splitLayout);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);

  const currentItemType = useSavedItemsStore((state) => state.currentItemType);

  const toggleDialog = () => {
    setSplitLayout(!splitLayout);
  };

  return currentItemType === "recipe" ? (
    <RecipePopUp toggleDialog={toggleDialog} />
  ) : (
    <SideList toggleDialog={toggleDialog} />
  );
};
