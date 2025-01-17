"use client";

// Package Imports
import { useState } from "react";

// Local Imports
import { useFetchRecipes } from "@/server/hooks/recipeHooks";
import Loader from "@/components/loader";
import { RecipeBox } from "@/components/recipe/recipe-box";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MainLayout } from "@/layouts/main";
import { ContentLayout } from "@/layouts/content";
import { SearchBar } from "@/components/search-bar";
import { SideList } from "@/components/side-list";

export default function RecipePage() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // fetch all the recipes at once (maybe add a max limit)
  // types are inferred from the useFetchRecipes hook
  const { data: allRecipes, isLoading } = useFetchRecipes();

  // this filteres the recipes based on the search query and returns the filtered recipes
  // if search query is empty, it returns all the recipes
  // when the search query changes, the filtered recipes are updated
  const filteredRecipes =
    searchQuery.trim() === ""
      ? allRecipes
      : allRecipes?.filter((recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <MainLayout
      headerComponent={
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      }
    >
      <ContentLayout>
        {/* Recipes */}
        <div className="flex flex-row h-full bg-background">
          <div className="w-[60%] h-auto bg-background">
            <ScrollArea>
              <div className="flex flex-wrap justify-start gap-4">
                {isLoading ? (
                  <Loader /> // show loader if recipes are still loading
                ) : (filteredRecipes ?? []).length > 0 ? (
                  (filteredRecipes ?? []).map((recipe) => (
                    <RecipeBox key={recipe._id?.toString()} recipe={recipe} />
                  ))
                ) : (
                  <p className="text-foreground">No recipes found.</p>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="w-[40%] px-24">
            <SideList />
          </div>
        </div>
      </ContentLayout>
    </MainLayout>
  );
}
