"use client";

// Package Imports
import Image from "next/image";
import React from "react";

// Local Imports
import { useFetchImageById } from "@/server/hooks/imageHooks";
import { useRecipeStore } from "@/stores/recipe/store";
import { RecipeMetaData, SavedRecipeMetaData } from "@/types/saved";

interface RecipeBoxProps {
  setOpen: (isOpen: boolean) => void;
  data: RecipeMetaData | SavedRecipeMetaData;
}

export const RecipeBox = ({ setOpen, data }: RecipeBoxProps) => {
  const setCurrentRecipe = useRecipeStore((state) => state.setCurrentRecipe);
  const setImageUrl = useRecipeStore((state) => state.setCurrentImageUrl);

  const { data: response, isLoading, error } = useFetchImageById(data.imageId);

  if (error) {
    console.error("Error fetching image:", error);
  }

  const handleRecipeClick = async () => {
    setCurrentRecipe(data);
    setImageUrl(response.base64Image);
    setOpen(true);
  };

  return (
    <>
      <div
        key={data._id.toString()}
        className="w-full sm:w-40 md:w-40 aspect-square rounded-lg relative shadow-lg overflow-hidden cursor-pointer z-10"
        onClick={handleRecipeClick}
      >
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            {/* Add a loading indicator */}
            <span className="text-gray-500">Loading...</span>
          </div>
        ) : (
          <Image
            src={response.base64Image}
            alt={data.title}
            fill
            className="object-cover"
          />
        )}
        {/* Make this a Hover Box */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-black bg-opacity-50">
          <h3 className="text-lg font-semibold truncate">{data.title}</h3>
        </div>
      </div>
    </>
  );
};
