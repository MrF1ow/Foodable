"use client";

// Package Imports
import { useState } from "react";

// Local Imports
import Loader from "@/components/loader";
import { RecipeBox } from "@/components/common/recipe/recipe-box";
import { RecipePopUp } from "@/components/common/recipe/recipe-popup";
import { useRecipeStore } from "@/stores/recipe/store";
import { useAllRecipes } from "@/server/hooks/recipeHooks";
import { RecipeMetaData } from "@/types/saved";

export default function Recipes() {
  const { recipes } = useAllRecipes(true);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const togglePopUp = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  return (
    <>
      {isOpen && <RecipePopUp toggleDialog={togglePopUp} />}
      <div className="h-full overflow-auto">
        <div className="flex flex-wrap justify-start gap-4 z-10">
          {recipes.length === 0 ? (
            <Loader /> // show loader if recipes are still loading
          ) : recipes.length > 0 ? (
            recipes.map((data: RecipeMetaData) => (
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
