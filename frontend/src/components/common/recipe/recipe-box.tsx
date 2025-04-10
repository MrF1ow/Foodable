"use client";

// Package Imports
import Image from "next/image";
import React from "react";

// Local Imports
import { useFetchImageById } from "@/server/hooks/imageHooks";
import { useRecipeStore } from "@/stores/recipe/store";
import { RecipeMetaData, SavedRecipeMetaData } from "@/types/saved";
import { Box } from "@/components/common/box";
import { isValidObjectId } from "@/utils/typeValidation/general";
import { useRecipeById } from "@/server/hooks/recipeHooks";

interface RecipeBoxProps {
  data: RecipeMetaData | SavedRecipeMetaData;
  handleBoxClick: () => void;
}

export const RecipeBox = ({ data, handleBoxClick }: RecipeBoxProps) => {
  const setCurrentRecipe = useRecipeStore((state) => state.setCurrentRecipe);
  const setImageUrl = useRecipeStore((state) => state.setCurrentImageUrl);

  const { image, isLoadingImage, errorImage } = useFetchImageById(data?.imageId, {
    enabled: !!data?.imageId && isValidObjectId(data?.imageId),
  });

  const { refetchRecipe } = useRecipeById(
    data._id.toString(),
    { enabled: !!data._id && isValidObjectId(data._id.toString()) }
  );


  if (isLoadingImage) {
    return <div>Loading...</div>;
  }

  if (errorImage) {
    return <div>Error loading image</div>;
  }

  const handleRecipeClick = async () => {
    setCurrentRecipe(data);
    setImageUrl(image.base64Image);
    refetchRecipe().then((response) => {
      if (response.data) {
        console.log("Recipe fetched successfully:", response.data);
        setCurrentRecipe(response.data);
      }
    });
    handleBoxClick();
  };

  return (
    <>
      <Box key={data._id.toString()} onClick={handleRecipeClick}>
        {isLoadingImage && !image && (
          <div className="flex items-center justify-center w-full h-full">
            {/* Add a loading indicator */}
            <span className="text-gray-500">Loading...</span>
          </div>
        )}

        {image && image.base64Image && (
          <Image
            src={image.base64Image}
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
