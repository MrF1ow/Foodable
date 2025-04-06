"use client";

// Package Imports
import { useEffect, useState } from "react";

// Local Imports
import { RecipeBox } from "@/components/common/recipe/recipe-box";
import { RecipePopUp } from "@/components/common/recipe/recipe-popup";
import { useRecipeStore } from "@/stores/recipe/store";
import { useGeneralStore } from "@/stores/general/store";
import { useAllRecipes } from "@/server/hooks/recipeHooks";
import { RecipeMetaData } from "@/types/saved";
import { SideList } from "@/components/common/side-list/side-list-client";
import { filterRecipes } from "@/utils/listItems";
import { checkRole } from "@/utils/roles";

export default function Recipes() {
  const { recipes } = useAllRecipes(true);

  const filter = useRecipeStore((state) => state.filter);
  const onForm = useRecipeStore((state) => state.onForm);
  const setOnForm = useRecipeStore((state) => state.setOnForm);
  const isMobile = useGeneralStore((state) => state.isMobile);
  const currentSideContent = useRecipeStore(
    (state) => state.currentSideContent
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeMetaData[]>([]);

  const togglePopUp = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  useEffect(() => {
    setFilteredRecipes(filterRecipes(recipes, filter));
  }, [recipes, filter]);

  if (isMobile && onForm) {
    return <SideList isUser={true} />;
  }

  return (
    <>
      {isOpen && <RecipePopUp toggleDialog={togglePopUp} />}
      <div className="h-full overflow-auto">
        <div className="flex flex-wrap justify-start gap-4 z-10">
          {filteredRecipes.length === 0 ? (
            <></>
          ) : filteredRecipes.length > 0 ? (
            filteredRecipes.map((data: RecipeMetaData) => (
              <RecipeBox
                key={data._id.toString()}
                setOpen={setIsOpen}
                data={data}
              />
            ))
          ) : (
            <p className="text-foreground">No recipes found.</p>
          )}
        </div>
      </div>
    </>
  );
}
