// Package Imports
import { useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";

// Local Imports
import { Card, CardContent } from "@/components/ui/card";
import pfp from "../../../public/images/pfp.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RecipeContent } from "./recipe-content";
import { RecipePopupHeader } from "./recipe-popup-header";
import { useRecipeStore } from "@/stores/recipe/store";
import { useGroceryStore } from "@/stores/grocery/store";
import { getAdditionalIngredients } from "@/utils/listItems";

interface RecipePopUpProps {
  toggleDialog: () => void;
  imageUrl: string;
}

export const RecipePopUp = ({ toggleDialog, imageUrl }: RecipePopUpProps) => {
  const recipe = useRecipeStore((state) => state.currentRecipe.data);
  const getMetadata = useRecipeStore((state) => state.getCurrentMetadata);
  const [recipeMetadata, setRecipeMetadata] = useState(
    getMetadata(recipe!._id.toString())
  );

  const setAdditionalIngredients = useRecipeStore(
    (state) => state.setAdditionalIngredients
  );
  const groceryMap = useGroceryStore((state) => state.map);

  useEffect(() => {
    if (recipe) {
      const additionalIngredients = getAdditionalIngredients(
        recipe.ingredients,
        groceryMap
      );
      setAdditionalIngredients(additionalIngredients);
    }
  }, [recipe]);

  if (!recipe) return null;
  return (
    <Card className="absolute top-0 left-0 z-50 w-full h-full bg-card-background overflow-hidden rounded-none shadow-none md:rounded-xl md:shadow-xl lg:rounded-xl lg:shadow-xl xl:rounded-xl xl:shadow-xl">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Recipe Header */}
        <RecipePopupHeader
          imageUrl={imageUrl}
          recipe={recipe}
          metadata={recipeMetadata}
        />

        {/* Recipe Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <RecipeContent recipe={recipe} />
        </div>

        {/* Back Button */}
        <div className="absolute top-0 left-0 text-foreground p-4 z-50">
          <BiArrowBack onClick={toggleDialog} size={40} />
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
      </CardContent>
    </Card>
  );
};
