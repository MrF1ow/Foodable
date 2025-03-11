"use client";

// Package Imports
import Image from "next/image";
import React from "react";

// Local Imports
import { useFetchImageById } from "@/server/hooks/imageHooks";
import { useRecipeStore } from "@/stores/recipe/store";
import { RecipeMetaData, SavedRecipeMetaData } from "@/types/saved";
import { Box } from "@/components/common/box";

interface RecipeBoxProps {
  setOpen: ((isOpen: boolean) => void) | ((isOpen: boolean) => void | any);
  data: RecipeMetaData | SavedRecipeMetaData;
}

export const RecipeBox = ({ setOpen, data }: RecipeBoxProps) => {
  const setCurrentRecipe = useRecipeStore((state) => state.setCurrentRecipe);
  const setImageUrl = useRecipeStore((state) => state.setCurrentImageUrl);

  const { data: response, isLoading, error } = useFetchImageById(data.imageId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading image</div>;
  }

  const handleRecipeClick = async () => {
    setCurrentRecipe(data);
    setImageUrl(response.base64Image);
    setOpen(true);
  };

  return (
    <>
      <Box keyValue={data._id.toString()} onClick={handleRecipeClick}>
        {isLoading && !response && (
          <div className="flex items-center justify-center w-full h-full">
            {/* Add a loading indicator */}
            <span className="text-gray-500">Loading...</span>
          </div>
        )}

        {response && response.base64Image && (
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
      </Box>
    </>
  );
};
