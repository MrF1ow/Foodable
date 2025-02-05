"use client";

// Package Imports
import { useEffect, useState } from "react";

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
import { FilterButton } from "@/components/search-bar/filter-button";

export default function RecipePage() {
  const allRecipes = useRecipeStore((state) => state.currentRecipes);
  const currentRecipe = useRecipeStore((state) => state.currentRecipeIndex);
  const currentImageUrl = useRecipeStore((state) => state.currentImageUrl);
  const setFilter = useRecipeStore((state) => state.setFilter);
  const filter = useRecipeStore((state) => state.filter);
  const filteredRecipes = useRecipeStore((state) => state.filteredRecipes);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    console.log("Filtered recipes updated:", filteredRecipes);
  }, [filteredRecipes]);

  const setSearchQuery = (searchQuery: string) => {
    console.log("searchQuery", searchQuery);
    setFilter({ ...filter, searchQuery });
  };

  const togglePopUp = () => {
    setIsOpen(!isOpen);
  };

  const Content = () => {
    return (
      <>
        <RecipesFetcher />
        {isOpen && (
          <RecipePopUp
            toggleDialog={togglePopUp}
            recipe={filteredRecipes[currentRecipe]}
            imageUrl={currentImageUrl}
          />
        )}
        <div className="h-full overflow-auto">
          <div className="flex flex-wrap justify-start gap-4 z-10">
            {allRecipes.length === 0 ? (
              <Loader /> // show loader if recipes are still loading
            ) : filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe, index) => (
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

  const RecipeFilterButton = () => {
    return <FilterButton setFilters={setFilter} filter={filter} />;
  };

  return (
    <MainLayout
      headerComponent={
        <SearchBar
          searchQuery={filter.searchQuery}
          setSearchQuery={setSearchQuery}
          FilterButton={RecipeFilterButton}
        />
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
