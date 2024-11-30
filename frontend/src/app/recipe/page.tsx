"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import searchIcon from "../../../public/images/search_icon_google.png";
import tuneIcon from "../../../public/images/tune_google.png";
import recipeImagePlaceholder from "../../../public/images/recipe_placeholder.png";
import addIcon from "../../../public/images/add_google.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Recipe } from "@/types";

export default function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        const data: Recipe[] = await response.json();
        setRecipes(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const searchRecipe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/recipes?title=${searchQuery}`);
      if (!response.ok) {
        throw new Error("Failed to fetch recipes by name");
      }
      const data: Recipe[] = await response.json();
      console.log("Data: ", data);
      setRecipes(data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="relative w-full max-w-lg mb-4">
        <Button
          variant="outline"
          onClick={searchRecipe}
          className="absolute inset-y-0 left-0 px-4 text-white bg-black border-0 rounded-l-lg focus:ring-0 hover:bg-gray-800 hover:text-white"
        >
          <Image
            src={searchIcon}
            alt="Search Icon"
            width={25}
            height={25}
            className="object-contain"
          />
        </Button>

        <Button
          variant="outline"
          className="absolute inset-y-0 right-0 px-4 text-white bg-black border-0 rounded-r-lg focus:ring-0 hover:bg-gray-800 hover:text-white"
        >
          <Image
            src={tuneIcon}
            alt="Tune Icon"
            width={25}
            height={25}
            className="object-contain"
          />
        </Button>

        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find Recipes ..."
          className="pl-14 pr-14 sm:pl-16 sm:pr-16 md:pl-18 md:pr-18 bg-black text-white placeholder-white border border-gray-700 rounded-lg"
        />
      </div>

      {/* Recipes */}
      <div className="flex flex-row h-full">
        <div className="w-full max-w-screen-lg">
          <div className="flex flex-wrap justify-start gap-4">
            {isLoading ? (
              <p className="text-black">Loading...</p>
            ) : recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div
                  key={recipe._id.toString()}
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
              <CardHeader className="bg-green-400 text-black text-center p-4 rounded-lg">
                <CardTitle className="text-2xl">Your List</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p>Card Content</p>
              </CardContent>
              <CardFooter className="flex justify-end p-4">
                <Image
                  src={addIcon}
                  width={60}
                  height={60}
                  alt="Add Grocery Item"
                  className="object-cover"
                />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
