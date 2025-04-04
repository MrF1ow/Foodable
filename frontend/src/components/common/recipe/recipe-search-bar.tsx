"use client";

import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/common/search-bar";
import { useRecipeStore } from "@/stores/recipe/store";
import RecipeFilterButton from "./recipe-filter-button";

export default function RecipeSearchBar() {
  const setFilter = useRecipeStore((state) => state.setFilter);
  const filter = useRecipeStore((state) => state.filter);
  const setSearchQuery = (searchQuery: string) => {
    setFilter({ ...filter, searchQuery });
  };

  const setCreateForm = useRecipeStore((state) => state.setCreateForm);

  const handleCreateRecipe = () => {
    setCreateForm(true);
  };

  return (
    <div className="flex justify-between">
      <SearchBar
        searchQuery={filter.searchQuery}
        setSearchQuery={setSearchQuery}
        FilterButton={RecipeFilterButton}
      />
      <Button onClick={handleCreateRecipe}>Create Recipe</Button>
    </div>
  );
}
