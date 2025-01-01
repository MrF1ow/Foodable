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
import { MainLayout } from "@/layouts/main";
import { Main } from "next/document";

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
    <MainLayout>
      {/* Search Bar */}
      <div className="flex items-center w-full max-w-md">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Find Recipes..."
            className="pl-10 pr-20 h-10 rounded-md bg-foreground text-background focus:outline-none"
          />
          <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-foreground text-background" />
        </div>
        {/* Filter Button - fix for options and such*/}
        <Button
          variant="outline"
          className="ml-4 h-10 px-4 rounded-md bg-foreground text-background"
        >
          <CiFilter className="mr-2 w-5 h-5" />
          Filter
        </Button>
      </div>

      {/* Recipes */}
      <div className="flex flex-row h-full">
        <div className="w-full max-w-screen-lg">
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
              <p className="text-black">No recipes found.</p>
            )}
          </div>
        </div>

        <div className="w-full max-w-screen-sm flex-1 ">
          <div className="h-[810px] flex flex-col">
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardHeader className="bg-primary text-black text-center p-4 rounded-lg">
                <CardTitle className="text-2xl">Your List</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p>Card Content</p>
              </CardContent>
              <CardFooter className="flex justify-end p-4">
                <div className="group">
                  <IoMdAddCircleOutline
                    className="text-primary group-hover:hidden transition-all duration-300 ease-in-out"
                    size={60}
                  />
                  <IoMdAddCircle
                    className="text-primary hidden group-hover:block transition-all duration-300 ease-in-out"
                    size={60}
                  />
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
