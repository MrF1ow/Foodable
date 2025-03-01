"use client";

import { SearchBar } from "@/components/common/search-bar";
import { useRecipeStore } from "@/stores/recipe/store";
import RecipeFilterButton from "./recipe-filter-button";

export default function RecipeSearchBar() {
  const setFilter = useRecipeStore((state) => state.setFilter);
  const filter = useRecipeStore((state) => state.filter);
  const setSearchQuery = (searchQuery: string) => {
    setFilter({ ...filter, searchQuery });
  };

  return (
    <SearchBar
      searchQuery={filter.searchQuery}
      setSearchQuery={setSearchQuery}
      FilterButton={RecipeFilterButton}
    />
  );
}
