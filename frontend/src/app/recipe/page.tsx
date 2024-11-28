"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import searchIcon from "../../../public/images/search_icon_google.png";
import tuneIcon from "../../../public/images/tune_google.png";
import { Card, CardTitle } from "@/components/ui/card";
import { Recipe } from "@/types";

export default function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("/api/recipes");
        const data: Recipe[] = await response.json();
        setRecipes(data);
        setFilteredRecipes(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredRecipes(recipes);
    } else {
      setFilteredRecipes(
        recipes.filter((recipe) =>
          recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, recipes]);

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="relative w-full max-w-lg mb-8">
        <Button
          variant="outline"
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
          ) : filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <Card
                key={recipe._id.toString()}
                className="w-full sm:w-40 md:w-40 bg-gray-800 text-white shadow-lg aspect-square border-green-500 flex flex-col rounded-lg"
              >
                <div className="flex-grow p-4"></div>
                <div
                  className="flex flex-row items-center justify-between p-4 w-full rounded-b-lg"
                  style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                  <CardTitle className="mr-2">{recipe.title}</CardTitle>
                  <span className="ml-2">{recipe.userRatings[0].rating} ☆</span>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-white">No recipes found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
