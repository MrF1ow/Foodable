"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import searchIcon from "../../../public/images/search_icon_google.png";
import tuneIcon from "../../../public/images/tune_google.png";
import recipeImagePlaceholder from "../../../public/images/recipe_placeholder.png";
import { Card, CardTitle } from "@/components/ui/card";
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
      const response = await fetch(
        `/api/recipes?title=${encodeURIComponent(searchQuery)}`
      );
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
      <div className="relative w-full max-w-lg mb-8">
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
          className="pl-14 pr-14 sm:pl-16 sm:pr-16 md:pl-18 md:pr-18 bg-black text-white placeholder-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-500"
        />
      </div>

      {/* Recipe Cards */}
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
                {/* Recipe Image */}
                <Image
                  src={recipeImagePlaceholder} // Use a default image if `recipe.image` is missing
                  alt={recipe.title}
                  fill
                  className="object-cover"
                />

                {/* Overlay with Title and Rating */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-transparent to-transparent text-white">
                  <h3 className="text-lg font-semibold truncate">
                    {recipe.title}
                  </h3>
                  <p className="text-sm">
                    {recipe.userRatings?.[0]?.rating || "No ratings"} ☆
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-black">No recipes found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
