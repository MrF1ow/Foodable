"use client";

import { FilterButton } from "@/components/common/search-bar/filter-button";
import { useRecipeStore } from "@/stores/recipe/store";

export default function RecipeFilterButton() {
  const setFilter = useRecipeStore((state) => state.setFilter);
  const filter = useRecipeStore((state) => state.filter);
  return <FilterButton setFilters={setFilter} filter={filter} />;
}
