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
import { Recipe } from "@/types";
import { RecipePopUp } from "@/components/recipe/popup";

export default function RecipePage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const togglePopUp = () => {
    setIsOpen(!isOpen);
  };

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

  const Content = () => {
    return (
      <>
        {isOpen && currentRecipe && (
          <RecipePopUp
            recipe={currentRecipe}
            toggleDialog={togglePopUp}
            imageUrl={currentRecipe.imageUrl}
          />
        )}
        <ScrollArea>
          <div className="flex flex-wrap justify-start gap-4">
            {isLoading ? (
              <Loader /> // show loader if recipes are still loading
            ) : (filteredRecipes ?? []).length > 0 ? (
              (filteredRecipes ?? []).map((recipe) => (
                <RecipeBox
                  key={recipe._id?.toString()}
                  recipe={recipe}
                  setRecipe={setCurrentRecipe}
                  setOpen={setIsOpen}
                />
              ))
            ) : (
              <p className="text-foreground">No recipes found.</p>
            )}
          </div>
        </ScrollArea>
      </>
    );
  };

  return (
    <MainLayout
      headerComponent={
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      }
    >
      <ContentLayout split leftSide={<Content />} rightSide={<SideList />} />
    </MainLayout>
  );
}
