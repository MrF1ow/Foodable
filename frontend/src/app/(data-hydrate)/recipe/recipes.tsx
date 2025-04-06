"use client";

// Package Imports
import { useEffect, useState } from "react";

// Local Imports
import { RecipeBox } from "@/components/common/recipe/recipe-box";
import { RecipePopUp } from "@/components/common/recipe/recipe-popup";
import { useRecipeStore } from "@/stores/recipe/store";
import { useAllRecipes } from "@/server/hooks/recipeHooks";
import { RecipeMetaData } from "@/types/saved";
import { filterRecipes } from "@/utils/listItems";

export default function Recipes() {
  const { recipes } = useAllRecipes(true);

  const filter = useRecipeStore((state) => state.filter);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeMetaData[]>([]);

  const togglePopUp = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };

  useEffect(() => {
    setFilteredRecipes(filterRecipes(recipes, filter));
  }, [recipes, filter]);

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
