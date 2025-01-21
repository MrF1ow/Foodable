// Package Imports
import { BiArrowBack } from "react-icons/bi";

// Local Imports
import { Card, CardContent } from "@/components/ui/card";
import pfp from "../../../public/images/pfp.jpg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Recipe } from "@/types";
import { RecipeContent } from "./recipe-content";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecipePopUpProps {
  recipe: Recipe;
  toggleDialog: () => void;
  imageUrl: string;
}

export const RecipePopUp = ({
  recipe,
  toggleDialog,
  imageUrl,
}: RecipePopUpProps) => {
  return (
    <Card className="absolute top-0 left-0 z-50 w-full h-full bg-card-background overflow-hidden">
      <CardContent className="p-0 h-full flex flex-col">
        {/* Recipe Header */}
        <div className="w-full h-[40%] relative">
          <img
            src={imageUrl}
            alt={recipe.title}
            className="object-cover w-full h-full"
          />
          <div className="absolute w-full bottom-0 left-0 p-4 text-white bg-black bg-opacity-50">
            <h3 className="text-4xl tracking-widest font-bold truncate p-2">
              {recipe.title}
            </h3>
          </div>
        </div>

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
