"use client";

import { BiArrowBack } from "react-icons/bi";

import { Recipe } from "@/types/recipe";
import { GroceryList } from "@/types/grocery";
import { validateRecipe } from "@/utils/typeValidation/recipes";
import { isValidObjectId } from "@/utils/typeValidation/general";
import { RecipeContent } from "./recipe/recipe-content";
import { RecipePopupHeader } from "./recipe/recipe-popup-header";
import { Card, CardContent } from "@/components/ui/card";
import { useRecipeStore } from "@/stores/recipe/store";

interface GeneralPopUpProps {
  toggleDialog: () => void;
  data: Recipe | GroceryList;
}

export const GeneralPopUp = ({ toggleDialog, data }: GeneralPopUpProps) => {
  const typeOfData = validateRecipe(data, isValidObjectId)
    ? "recipe"
    : "grocery";

  const currentImageUrl = useRecipeStore((state) => state.currentImageUrl);

  const MainCardContent = () => {
    if (typeOfData === "recipe") {
      return (
        <CardContent className="p-0 h-full flex flex-col">
          <RecipePopupHeader
            imageUrl={currentImageUrl}
            recipe={data as Recipe}
          />
          <RecipeContent recipe={data as Recipe} />
        </CardContent>
      );
    } else {
      return (
        <div>
          <h1>Grocery List</h1>
          <p>{data.title}</p>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <Card className="w-[400px] max-w-[90%] p-4 rounded-xl shadow-lg bg-card-background text-foreground">
        <MainCardContent />
        <div className="absolute top-0 left-0 text-foreground p-4 z-50">
          <BiArrowBack onClick={toggleDialog} size={40} />
        </div>
      </Card>
    </div>
  );
};
