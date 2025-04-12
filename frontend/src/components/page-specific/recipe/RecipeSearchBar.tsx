"use client";

import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import { useRecipeStore } from "@/stores/recipe/store";
import { useGeneralStore } from "@/stores/general/store";
import RecipeFilterButton from "./RecipeFilterButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { FORM_NAMES } from "@/lib/constants/forms";
import { useAuth } from "@clerk/nextjs";

export default function RecipeSearchBar() {
  const { isSignedIn } = useAuth();
  const setFilter = useRecipeStore((state) => state.setFilter);
  const filter = useRecipeStore((state) => state.filter);
  const isMobile = useGeneralStore((state) => state.isMobile);
  const currentForm = useGeneralStore((state) => state.currentForm);
  const setCurrentForm = useGeneralStore(
    (state) => state.setCurrentForm
  );
  const setShowPortal = useGeneralStore((state) => state.setShowPortal);
  const setSearchQuery = (searchQuery: string) => {
    setFilter({ ...filter, searchQuery });
  };

  const handleCreateRecipe = () => {
    setCurrentForm(FORM_NAMES.CREATE_RECIPE);
    setShowPortal(true);
  };

  const handleGroceryList = () => {
    setCurrentForm(FORM_NAMES.GROCERY_LIST);
    setShowPortal(true);
  };

  const handleGroceryListClose = () => {
    setCurrentForm(null);
    setShowPortal(false);
  };

  return (
    <div className="flex justify-between gap-2">
      <SearchBar
        searchQuery={filter.searchQuery}
        setSearchQuery={setSearchQuery}
        FilterButton={
          isMobile && currentForm === FORM_NAMES.GROCERY_LIST
            ? () => (
              <Button onClick={handleGroceryListClose} className="ml-4">
                Close List
              </Button>
            )
            : RecipeFilterButton
        }
      />
      {isMobile && currentForm === null ? (
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
            {isSignedIn && (
              <DropdownMenuItem onClick={handleCreateRecipe}>
                Create Recipe
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (!isMobile && isSignedIn) ? (
        <Button onClick={handleCreateRecipe}>Create Recipe</Button>
      ) : null}
    </div>
  );
}

