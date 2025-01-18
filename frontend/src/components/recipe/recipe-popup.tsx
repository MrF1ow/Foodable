import { BiArrowBack } from "react-icons/bi";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import logo from "../../../public/images/logo_current_no_shadow.png";
import { Recipe } from "@/types";
import { ScrollArea } from "../ui/scroll-area";

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
    <Card className="absolute top-0 left-0 z-50 w-full h-full bg-card-background overflow-auto">
      <CardContent className="p-0">
        <img src={imageUrl} alt={recipe.title} />
        <ScrollArea className="relative w-full h-full">
          {/* Fixed Header */}
          <div className="top-0 left-0 w-full h-[40%]">
            <Image
              src={imageUrl}
              alt={recipe.title}
              layout="fill"
              objectFit="cover"
              sizes="100%"
            />
            <div className="absolute w-full bottom-0 left-0 p-4 text-white bg-black bg-opacity-50">
              <h3 className="text-lg font-semibold truncate">{recipe.title}</h3>
            </div>
            <div className="absolute top-0 left-0 text-foreground p-4">
              <BiArrowBack onClick={toggleDialog} size={40} />
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
