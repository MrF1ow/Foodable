"use client";

import FilterButton from "@/components/FilterButton";
import { useRecipeStore } from "@/stores/recipe/store";
import { JSX } from "react";

export default function RecipeFilterButton(): JSX.Element {
  const setFilter = useRecipeStore((state) => state.setFilter);
  const filter = useRecipeStore((state) => state.filter);

  const handleFilterChange = (
    filterType: "price" | "timeApprox" | "ingredientAmount",
    value: -1 | 0 | 1
  ) => {
    // Update filter state in zustand store
    const updatedFilter = {
      searchQuery: filter.searchQuery,
      price: filterType === "price" ? value : 0,
      timeApprox: filterType === "timeApprox" ? value : 0,
      ingredientAmount: filterType === "ingredientAmount" ? value : 0,
    };

    setFilter(updatedFilter);
  };
  return <FilterButton setFilters={setFilter} handleFilterChange={handleFilterChange} filter={filter} />;
}
