"use client";

import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/common/search-bar";
import { useRecipeStore } from "@/stores/recipe/store";
import { useGeneralStore } from "@/stores/general/store";
import RecipeFilterButton from "./recipe-filter-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function RecipeSearchBar() {
  const setFilter = useRecipeStore((state) => state.setFilter);
  const filter = useRecipeStore((state) => state.filter);
  const isMobile = useGeneralStore((state) => state.isMobile);
  const setSearchQuery = (searchQuery: string) => {
    setFilter({ ...filter, searchQuery });
  };

  const setCreateForm = useRecipeStore((state) => state.setCreateForm);
  const createForm = useRecipeStore((state) => state.createForm);
  const onForm = useRecipeStore((state) => state.onForm);
  const setOnForm = useRecipeStore((state) => state.setOnForm);

  const handleCreateRecipe = () => {
    setOnForm(true);
    setCreateForm(true);
  };
  const handleGroceryList = () => {
    setOnForm(true);
    setCreateForm(false);
  };

  return (
    <div className="flex justify-between gap-2">
      <SearchBar
        searchQuery={filter.searchQuery}
        setSearchQuery={setSearchQuery}
        FilterButton={
          isMobile && onForm && !createForm
            ? () => (
                <Button onClick={() => setOnForm(false)} className="ml-4">
                  Close List
                </Button>
              )
            : RecipeFilterButton
        }
      />
      {isMobile && (createForm || !onForm) ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="!h-10 !w-12 bg-card-background"
            >
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleGroceryList}>
              Grocery List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCreateRecipe}>
              Create Recipe
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : !isMobile ? (
        <Button onClick={handleCreateRecipe}>Create Recipe</Button>
      ) : null}
    </div>
  );
}
