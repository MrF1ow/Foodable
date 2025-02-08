// Package Imports
import { BiArrowBack } from "react-icons/bi";

// Local Imports
import { Card, CardContent } from "@/components/ui/card";
import pfp from "../../../public/images/pfp.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Recipe } from "@/types/recipe";
import { RecipeContent } from "./recipe-content";
import { RecipePopupHeader } from "./recipe-popup-header";
import { GeneralSave } from "@/components/general-save";

interface RecipePopUpProps {
  recipe: Recipe;
  toggleDialog: () => void;
  imageUrl: string;
}

export const RecipePopUp = ({
  toggleDialog,
  recipe,
  imageUrl,
}: RecipePopUpProps) => {
  return (
    <Card className="absolute top-0 left-0 z-50 w-full h-full bg-card-background overflow-hidden rounded-none shadow-none md:rounded-xl md:shadow-xl lg:rounded-xl lg:shadow-xl xl:rounded-xl xl:shadow-xl">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Recipe Header */}
        <RecipePopupHeader imageUrl={imageUrl} recipe={recipe} />

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
