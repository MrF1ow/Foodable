"use client";

// Package Imports
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Local Imports
import RecipeBox from "@/components/page-specific/recipe/RecipeBox";
import { useRecipeStore } from "@/stores/recipe/store";
import { useAllRecipes } from "@/server/hooks/recipeHooks";
import { RecipeMetaData } from "@/types/saved";
import { filterRecipes } from "@/lib/utils/listItems";
import RecipePageInjections from "@/components/portal-injections/RecipePageInjections";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Recipes() {
  const { recipes } = useAllRecipes(true);
  const router = useRouter();
  const filter = useRecipeStore((state) => state.filter);

  const [filteredRecipes, setFilteredRecipes] = useState<RecipeMetaData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recipesPerPage, setRecipesPerPage] = useState<number>(5);

  // Responsive pagination logic
  useEffect(() => {
    const updateRecipesPerPage = () => {
      if (window.innerWidth >= 1024) {
        setRecipesPerPage(20); // lg
      } else if (window.innerWidth >= 768) {
        setRecipesPerPage(7); // md
      } else {
        setRecipesPerPage(5); // base
      }
    };

    updateRecipesPerPage();
    window.addEventListener("resize", updateRecipesPerPage);
    return () => window.removeEventListener("resize", updateRecipesPerPage);
  }, []);

  // Update filtered recipes when data or filter changes
  useEffect(() => {
    const updated = filterRecipes(recipes, filter);
    setFilteredRecipes(updated);
    setCurrentPage(1);
  }, [recipes, filter]);

  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
  const paginatedRecipes = filteredRecipes.slice(
    (currentPage - 1) * recipesPerPage,
    currentPage * recipesPerPage
  );

  const handleBoxClick = (data: RecipeMetaData) => {
    router.push(`/recipe/${data._id}`);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <div className="h-full overflow-auto">
        <div className="flex flex-wrap justify-start gap-4 z-10">
          {paginatedRecipes.length === 0 ? (
            <p className="text-foreground">No recipes found.</p>
          ) : (
            paginatedRecipes.map((data: RecipeMetaData) => (
              <RecipeBox
                key={data._id.toString()}
                data={data}
                handleBoxClick={() => handleBoxClick(data)}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 pb-24 px-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(i + 1);
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <RecipePageInjections />
    </>
  );
}
