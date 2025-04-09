// Package Imports
import { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useParams } from "next/navigation";

// Local Imports
import { Card, CardContent } from "@/components/ui/card";
import pfp from "../../../../public/images/pfp.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RecipeContent } from "./recipe-content";
import { RecipePopupHeader } from "./recipe-popup-header";
import { useRecipeStore } from "@/stores/recipe/store";
import { useGroceryStore } from "@/stores/grocery/store";
import { getAdditionalIngredients } from "@/utils/listItems";
import { useRecipeById } from "@/server/hooks/recipeHooks";
import { getRouteParam } from "@/utils/routeHelpers";

interface RecipePopUpProps {
  toggleDialog?: () => void;
}


export const RecipePopUp = ({ toggleDialog }: RecipePopUpProps) => {
  const { id } = useParams();

  const recipeId = getRouteParam(id);
  if (!recipeId || recipeId === "undefined") {
    console.error("ID is undefined or null");
    return null;
  }

  const currentData = useRecipeStore((state) => state.currentRecipe);
  const imageUrl = useRecipeStore((state) => state.currentImageUrl);

  if (!currentData) return null;

  const { recipe, isLoadingRecipe } = useRecipeById(
    recipeId,
    { enabled: !!recipeId }
  );



  return (
    <Card className="absolute top-0 left-0 z-50 w-full h-full bg-card-background overflow-hidden rounded-none shadow-none md:rounded-xl md:shadow-xl lg:rounded-xl lg:shadow-xl xl:rounded-xl xl:shadow-xl">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Loading State: Making it Look Better */}
        {isLoadingRecipe && <div>Loading...</div>}

        {recipe && !isLoadingRecipe && (
          <>
            {/* Recipe Header */}
            <RecipePopupHeader
              imageUrl={imageUrl}
              recipe={recipe}
            />

            {/* Recipe Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <RecipeContent recipe={recipe} />
            </div>

            {/* Back Button */}
            <div className="absolute top-0 left-0 text-foreground p-4 z-50">
              <BiArrowBack size={40} />
            </div>

            {/* Profile Picture */}
            <div className="absolute top-0 right-0 text-foreground p-4 z-50">
              <Avatar>
                <AvatarImage src={pfp.src} alt={"PFP"} width={60} height={60} />
                <AvatarFallback>
                  <div>Hello</div>
                </AvatarFallback>
              </Avatar>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
