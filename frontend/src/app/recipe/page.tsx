"use client";

// Package Imports
import { useState } from "react";
import Image from "next/image";
import {
  IoMdAddCircleOutline,
  IoIosSearch,
  IoMdAddCircle,
} from "react-icons/io";
import { CiFilter } from "react-icons/ci";

// Local Imports
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFetchRecipes } from "@/server/hooks/recipeHooks";
import Loader from "@/components/loader";
import recipeImagePlaceholder from "../../../public/images/recipe_placeholder.png";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MainLayout } from "@/layouts/main";
import { ContentLayout } from "@/layouts/content";
import { SearchBar } from "@/components/search-bar";

export default function RecipePage() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // fetch all the recipes at once (maybe add a max limit)
  // types are inferred from the useFetchRecipes hook
  const { data: allRecipes, isLoading } = useFetchRecipes();

  // this filteres the recipes based on the search query and returns the filtered recipes
  // if search query is empty, it returns all the recipes
  // when the search query changes, the filtered recipes are updated
  const filteredRecipes =
    searchQuery.trim() === ""
      ? allRecipes
      : allRecipes?.filter((recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <MainLayout
      headerComponent={
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      }
    >
      <ContentLayout>
        {/* Recipes */}
        <div className="flex flex-row h-full bg-background">
          <div className="w-[60%] h-auto bg-background">
            <ScrollArea>
              <div className="flex flex-wrap justify-start gap-4">
                {isLoading ? (
                  <Loader /> // show loader if recipes are still loading
                ) : (filteredRecipes ?? []).length > 0 ? (
                  (filteredRecipes ?? []).map((recipe) => (
                    <div
                      key={recipe._id?.toString()}
                      className="w-full sm:w-40 md:w-40 aspect-square relative rounded-lg shadow-lg overflow-hidden"
                    >
                      <Image
                        src={recipeImagePlaceholder}
                        alt={recipe.title}
                        fill
                        className="object-cover"
                      />

                      <div
                        className="absolute bottom-0 left-0 right-0 p-4 text-white"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                      >
                        <h3 className="text-lg font-semibold truncate">
                          {recipe.title}
                        </h3>
                        <p className="text-sm">
                          {recipe.userRatings?.[0]?.rating} ☆
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-foreground">No recipes found.</p>
                )}
              </div>
            </ScrollArea>
          </div>
          <div className="w-[40%] px-24">
            <Card className="h-full flex flex-col bg-card-background rounded-lg">
              <CardHeader className="bg-primary text-[#202020] text-center rounded-lg">
                <CardTitle className="text-2xl">Your List</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p>Card Content</p>
              </CardContent>
              <CardFooter className="flex justify-end p-4">
                <div className="group transition-all duration-300 ease-in-out">
                  <IoMdAddCircleOutline
                    className="text-primary group-hover:hidden"
                    size={60}
                  />
                  <IoMdAddCircle
                    className="text-primary hidden group-hover:block"
                    size={60}
                  />
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </ContentLayout>
    </MainLayout>
  );
}
