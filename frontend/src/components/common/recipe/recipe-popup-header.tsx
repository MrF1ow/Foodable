import { useState } from "react";
import { useEffect } from "react";

import { Recipe } from "@/types/recipe";
import { SaveBookmark } from "@/components/common/saved/save-bookmark";
import { useAllSavedItems } from "@/server/hooks/savedItemsHooks";
import { getIsItemSaved } from "@/utils/listItems";

interface RecipePopupHeaderProps {
  imageUrl: string;
  recipe: Recipe;
  setOpen?: (arg0: boolean) => void;
}

export const RecipePopupHeader = ({
  imageUrl,
  recipe,
  setOpen,
}: RecipePopupHeaderProps) => {
  const { savedItems } = useAllSavedItems({ enabled: true });

  const [isSaved, setIsSaved] = useState<boolean>(false);

  // useEffect to update 'isSaved' whenever savedItems change
  useEffect(() => {
    if (savedItems && savedItems.recipes) {
      const saved = getIsItemSaved(recipe, savedItems.recipes);
      setIsSaved(saved);
    }
  }, [savedItems, recipe]);

  return (
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
        <SaveBookmark isSaved={isSaved} data={recipe} setOpen={setOpen} />
      </div>
    </div>
  );
};
