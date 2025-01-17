"use client";

// Package Imports
import Image from "next/image";
import React, { useEffect, useState } from "react";
// import { useRouter, usePathname } from "next/navigation";

// Local Imports
import logo from "../../../public/images/logo_current_no_shadow.png";
import { useFetchImageBySourceId } from "@/server/hooks/imageHooks";
import { Recipe } from "@/types";

interface RecipeBoxProps {
  recipe: Recipe;
  setRecipe: (recipe: Recipe) => void;
  setOpen: (isOpen: boolean) => void;
}

export const RecipeBox = ({ recipe, setRecipe, setOpen }: RecipeBoxProps) => {
  const {
    data: response,
    isLoading,
    error,
  } = useFetchImageBySourceId(recipe._id ? recipe._id.toString() : "");

  useEffect(() => {
    if (response && response.base64Image) {
      recipe.imageUrl = response.base64Image;
    }
  }, [response]);

  if (error) {
    console.error("Error fetching image:", error);
  }

  return (
    <>
      <div
        key={recipe._id?.toString()}
        className="w-full sm:w-40 md:w-40 aspect-square relative rounded-lg shadow-lg overflow-hidden"
        onClick={() => {
          setRecipe(recipe);
          setOpen(true);
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            {/* Add a loading indicator */}
            <span className="text-gray-500">Loading...</span>
          </div>
        ) : (
          <Image
            src={recipe.imageUrl || logo}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-black bg-opacity-50">
          <h3 className="text-lg font-semibold truncate">{recipe.title}</h3>
        </div>
      </div>
    </>
  );
};
