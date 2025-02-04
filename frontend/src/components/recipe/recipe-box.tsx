"use client";

// Package Imports
import Image from "next/image";
import React from "react";

// Local Imports
import { useFetchImageById } from "@/server/hooks/imageHooks";
import { useRecipeStore } from "@/stores/recipe/store";
import { Recipe } from "@/types/recipe";

interface RecipeBoxProps {
  setOpen: (isOpen: boolean) => void;
  indexOfRecipe: number;
}

export const RecipeBox = ({ setOpen, indexOfRecipe }: RecipeBoxProps) => {
  const allRecipes = useRecipeStore((state) => state.currentRecipes);
  const setImageUrl = useRecipeStore((state) => state.setCurrentImageUrl);
  const setCurrentRecipe = useRecipeStore(
    (state) => state.setCurrentRecipeIndex
  );
  const recipe = allRecipes[indexOfRecipe];

  const {
    data: response,
    isLoading,
    error,
  } = useFetchImageById(recipe.imageId ? recipe.imageId.toString() : "");

  if (error) {
    console.error("Error fetching image:", error);
  }

  return (
    <>
      <div
        key={recipe._id?.toString()}
        className="w-full sm:w-40 md:w-40 aspect-square rounded-lg relative shadow-lg overflow-hidden cursor-pointer z-10"
        onClick={() => {
          setOpen(true);
          setImageUrl(response.base64Image);
          setCurrentRecipe(indexOfRecipe);
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            {/* Add a loading indicator */}
            <span className="text-gray-500">Loading...</span>
          </div>
        ) : (
          <Image
            src={response.base64Image}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        )}
        {/* Make this a Hover Box */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-black bg-opacity-50">
          <h3 className="text-lg font-semibold truncate">{recipe.title}</h3>
        </div>
      </div>
    </>
  );
};
