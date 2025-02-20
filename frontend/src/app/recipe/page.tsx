"use client";

// Package Imports
import { useState } from "react";

// Local Imports
import Loader from "@/components/loader";
import { RecipeBox } from "@/components/common/recipe/recipe-box";
import { MainLayout } from "@/layouts/common/main";
import { ContentLayout } from "@/layouts/common/content";
import { SearchBar } from "@/components/common/search-bar";
import { SideList } from "@/components/common/side-list";
import { RecipePopUp } from "@/components/common/recipe/recipe-popup";
import { RecipesFetcher } from "@/components/common/recipe/recipe-fetcher";
import { useRecipeStore } from "@/stores/recipe/store";
import { FilterButton } from "@/components/common/search-bar/filter-button";

export default function RecipePage() {
  const allRecipes = useRecipeStore((state) => state.currentRecipes);
  const currentImageUrl = useRecipeStore((state) => state.currentImageUrl);
  const setFilter = useRecipeStore((state) => state.setFilter);
  const setCurrentRecipe = useRecipeStore((state) => state.setCurrentRecipeId);
  const filter = useRecipeStore((state) => state.filter);
  const filteredRecipes = useRecipeStore((state) => state.filteredRecipes);
  const fetchFullRecipe = useRecipeStore((state) => state.fetchFullRecipe);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const setSearchQuery = (searchQuery: string) => {
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
          <RecipePopUp toggleDialog={togglePopUp} imageUrl={currentImageUrl} />
        )}
        <div className="h-full overflow-auto">
          <div className="flex flex-wrap justify-start gap-4 z-10">
            {allRecipes.length === 0 ? (
              <Loader /> // show loader if recipes are still loading
            ) : filteredRecipes.length > 0 ? (
              filteredRecipes.map((data) => (
                <RecipeBox
                  key={data._id.toString()}
                  setOpen={setIsOpen}
                  fetchAndStore={fetchFullRecipe}
                  setId={setCurrentRecipe}
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
