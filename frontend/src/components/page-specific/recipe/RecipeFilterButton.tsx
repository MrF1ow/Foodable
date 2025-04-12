"use client";

import FilterButton from "@/components/FilterButton";
import { useRecipeStore } from "@/stores/recipe/store";
import { JSX } from "react";

export default function RecipeFilterButton(): JSX.Element {
  const setFilter = useRecipeStore((state) => state.setFilter);
  const filter = useRecipeStore((state) => state.filter);
  return <FilterButton setFilters={setFilter} filter={filter} />;
}
