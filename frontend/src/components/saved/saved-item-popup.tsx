"use client";

import { BiArrowBack } from "react-icons/bi";

import { Recipe } from "@/types/recipe";
import { GroceryList } from "@/types/grocery";
import { RecipeContent } from "../recipe/recipe-content";
import { RecipePopupHeader } from "../recipe/recipe-popup-header";
import { Card, CardContent } from "@/components/ui/card";
import { useRecipeStore } from "@/stores/recipe/store";
import { Metadata, RecipeMetaData } from "@/types/saved";
import { useEffect } from "react";

interface SavedItemPopupProps {
  toggleDialog: () => void;
  typeOfData: "recipe" | "grocery";
  data: Recipe | GroceryList;
  metadata: Metadata;
}

export const SavedItemPopup = ({
  toggleDialog,
  typeOfData,
  data,
  metadata,
}: SavedItemPopupProps) => {
  const currentImageUrl = useRecipeStore((state) => state.currentImageUrl);

  const MainCardContent = () => {
    if (typeOfData === "recipe") {
      return (
        <CardContent className="p-0 h-full flex flex-col">
          <RecipePopupHeader
            imageUrl={currentImageUrl}
            recipe={data as Recipe}
            metadata={metadata as RecipeMetaData}
          />
          <div className="flex-1 overflow-y-auto p-4">
            <RecipeContent recipe={data as Recipe} />
          </div>
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
    <Card className="absolute top-0 left-0 p-0 w-full h-full rounded-xl shadow-lg bg-card-background text-foreground overflow-hidden">
      <div className="absolute top-0 left-0 text-foreground p-4 z-50">
        <BiArrowBack onClick={toggleDialog} size={40} />
      </div>
      <MainCardContent />
    </Card>
  );
};
