"use client";

// Package Imports
import { useState } from "react";

// Local Imports
import Loader from "@/components/loader";
import { RecipeBox } from "@/components/recipe/recipe-box";
import { MainLayout } from "@/layouts/main";
import { ContentLayout } from "@/layouts/content";
import { SearchBar } from "@/components/search-bar";
import { SideList } from "@/components/side-list";
import { RecipePopUp } from "@/components/recipe/recipe-popup";
import { RecipesFetcher } from "@/components/recipe/recipe-fetcher";
import { useRecipeStore } from "@/stores/recipe/store";

export default function RecipePage() {
  const allRecipes = useRecipeStore((state) => state.currentRecipes);
  const currentRecipe = useRecipeStore((state) => state.currentRecipeIndex);
  const currentImageUrl = useRecipeStore((state) => state.currentImageUrl);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const togglePopUp = () => {
    setIsOpen(!isOpen);
  };

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
        <RecipesFetcher />
        {isOpen && (
          <RecipePopUp
            toggleDialog={togglePopUp}
            recipe={allRecipes[currentRecipe]}
            imageUrl={currentImageUrl}
          />
        )}
        <div className="h-full overflow-auto">
          <div className="flex flex-wrap justify-start gap-4 z-10">
            {allRecipes.length === 0 ? (
              <Loader /> // show loader if recipes are still loading
            ) : (filteredRecipes ?? []).length > 0 ? (
              (filteredRecipes ?? []).map((recipe, index) => (
                <RecipeBox
                  key={recipe._id?.toString()}
                  setOpen={setIsOpen}
                  indexOfRecipe={index}
                />
              ))
            ) : (
              <p className="text-foreground">No recipes found.</p>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <MainLayout
      headerComponent={
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      }
    >
      <ContentLayout
        split
        mainContent={<Content />}
        subContent={<SideList />}
      />
    </MainLayout>
  );
}
