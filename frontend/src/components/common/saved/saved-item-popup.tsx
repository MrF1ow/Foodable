"use client";

// Package Imports
import { BiArrowBack } from "react-icons/bi";

// Local Imports
import { Recipe } from "@/types/recipe";
import { GroceryList } from "@/types/grocery";
import { RecipeContent } from "../recipe/recipe-content";
import { RecipePopupHeader } from "../recipe/recipe-popup-header";
import { Card, CardContent } from "@/components/ui/card";
import { useRecipeStore } from "@/stores/recipe/store";
import { useGeneralStore } from "@/stores/general/store";
import { useSavedItemsStore } from "@/stores/saved/store";
import { useGroceryStore } from "@/stores/grocery/store";

export const SavedItemPopup = () => {
  const splitLayout = useGeneralStore((state) => state.splitLayout);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);

  const currentItem = useSavedItemsStore((state) => state.currentItem);
  const currentImageUrl = useRecipeStore((state) => state.currentImageUrl);

  const currentRecipe = useRecipeStore((state) => state.currentRecipe);
  const currentGroceryList = useGroceryStore((state) => state.currentList);

  const toggleDialog = () => {
    setSplitLayout(!splitLayout);
  };

  if (!currentItem) return null;

  const MainCardContent = () => {
    if ("ingredients" in currentItem) {
      return (
        <CardContent className="p-0 h-full flex flex-col">
          <RecipePopupHeader
            imageUrl={currentImageUrl}
            recipe={currentRecipe as Recipe}
            setOpen={toggleDialog}
          />
          <div className="flex-1 overflow-y-auto p-4">
            <RecipeContent recipe={currentRecipe as Recipe} />
          </div>
        </CardContent>
      );
    } else {
      return (
        <div>
          <h1>Grocery List</h1>
          <p>{currentItem.title}</p>
        </div>
      );
    }
  };

  return (
    <Card className="absolute top-0 left-0 p-0 w-full h-full rounded-xl shadow-lg bg-card-background text-foreground overflow-hidden">
      <div className="absolute top-0 left-0 text-foreground p-4 z-50">
        <BiArrowBack onClick={toggleDialog} size={40} />
      </div>
      <MainCardContent />
    </Card>
  );
};
