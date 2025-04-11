"use client";

// Package Imports
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Local Imports
import RecipeBox from "@/components/page-specific/recipe/RecipeBox";
import { useRecipeStore } from "@/stores/recipe/store";
import { useAllRecipes } from "@/server/hooks/recipeHooks";
import { RecipeMetaData } from "@/types/saved";
import { filterRecipes } from "@/lib/utils/listItems";
import RecipePageInjections from "@/components/portal-injections/RecipePageInjections";

export default function Recipes() {
  const { recipes } = useAllRecipes(true);

  const router = useRouter();

  const filter = useRecipeStore((state) => state.filter);

  const [filteredRecipes, setFilteredRecipes] = useState<RecipeMetaData[]>([]);

  useEffect(() => {
    setFilteredRecipes(filterRecipes(recipes, filter));
  }, [recipes, filter]);

  const handleBoxClick = (data: RecipeMetaData) => {
    router.push(`/recipe/${data._id}`);
  };

  return (
    <>
      <div className="h-full overflow-auto">
        <div className="flex flex-wrap justify-start gap-4 z-10">
          {filteredRecipes.length === 0 ? (
            <></>
          ) : filteredRecipes.length > 0 ? (
            filteredRecipes.map((data: RecipeMetaData) => (
              <RecipeBox
                key={data._id.toString()}
                data={data}
                handleBoxClick={() => handleBoxClick(data)}
              />
            ))
          ) : (
            <p className="text-foreground">No recipes found.</p>
          )}
        </div>
      </div>

      <RecipePageInjections />

    </>
  );
}
