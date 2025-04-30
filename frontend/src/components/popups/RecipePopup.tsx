// Local Imports
import { Card, CardContent } from "@/components/ui/card";
import {
  RecipeContent,
  RecipePopupHeader,
} from "@/components/page-specific/recipe/RecipePopupParts";
import { useRecipeStore } from "@/stores/recipe/store";
import { JSX } from "react";
import { createToMutate } from "@/lib/utils/listItems";
import { useAllSavedItems, useDeleteSavedItem } from "@/server/hooks/savedItemsHooks";

interface RecipePopUpProps {
  className?: string;
  additionalBackButtonClick?: () => void;
}

export default function RecipePopUp({
  className,
  additionalBackButtonClick,
}: RecipePopUpProps): JSX.Element {
  const currentData = useRecipeStore((state) => state.currentRecipe);
  const imageUrl = useRecipeStore((state) => state.currentImageUrl);
  const { refetchSavedItems } = useAllSavedItems({ enabled: true });

  const { deleteSavedItem } = useDeleteSavedItem();

  if (!currentData) return <></>;

  const handleBackButtonClick = () => {
    additionalBackButtonClick?.();
  };

  const handleRemoveSavedRecipe = async () => {
    const toDelete = createToMutate(currentData, currentData.title);

    deleteSavedItem(toDelete);
    await refetchSavedItems();
  }

  return (
    <>
      <Card
        className={`z-[50] w-full h-full bg-card-background overflow-hidden rounded-none shadow-none md:rounded-xl md:shadow-xl lg:rounded-xl lg:shadow-xl xl:rounded-xl xl:shadow-xl ${className}`}
      >
        <CardContent className="p-0 h-full flex flex-col">
          {currentData && (
            <>
              {/* Recipe Header */}
              <RecipePopupHeader
                imageUrl={imageUrl}
                handleBackButton={handleBackButtonClick}
                handleRemoveItem={handleRemoveSavedRecipe}
              />

              {/* Recipe Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <RecipeContent />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
