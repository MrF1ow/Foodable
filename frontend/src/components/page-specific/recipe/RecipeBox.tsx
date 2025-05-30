"use client";

// Package Imports
import Image from "next/image";
import React, { JSX } from "react";

// Local Imports
import { useFetchImageById } from "@/server/hooks/imageHooks";
import { useRecipeStore } from "@/stores/recipe/store";
import { RecipeMetaData, SavedRecipeMetaData } from "@/types/saved";
import Box from "@/components/Box";
import { isValidObjectId } from "@/lib/validation/types/general";
import { useRecipeById } from "@/server/hooks/recipeHooks";
import logo from "../../../../public/images/logo_current_no_shadow.png";
import Spinner from "@/components/Spinner";

interface RecipeBoxProps {
  data: RecipeMetaData | SavedRecipeMetaData;
  handleBoxClick: () => void;
  width: string;
}

export default function RecipeBox({
  data,
  handleBoxClick,
  width,
}: RecipeBoxProps): JSX.Element {
  const setCurrentRecipe = useRecipeStore((state) => state.setCurrentRecipe);
  const setImageUrl = useRecipeStore((state) => state.setCurrentImageUrl);

  const { image, isLoadingImage, errorImage } = useFetchImageById(
    data?.imageId?.toString() ?? null,
    {
      enabled: !!data?.imageId && isValidObjectId(data?.imageId),
    }
  );

  const { refetchRecipe } = useRecipeById(data._id.toString(), {
    enabled: !!data._id && isValidObjectId(data._id.toString()),
  });

  if (isLoadingImage) {
    return (
      <div className="w-[200px] h-[200px] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (errorImage) {
    return (
      <div className="w-[200px] h-[200px] flex items-center justify-center text-sm text-red-500">
        Error loading image
      </div>
    );
  }

  const handleRecipeClick = async () => {
    setCurrentRecipe(data);
    setImageUrl(image ? image.base64Image : null);
    const response = await refetchRecipe();
    if (response.data) {
      console.log("Recipe fetched successfully:", response.data);
      setCurrentRecipe(response.data);
    }
    handleBoxClick();
  };

  return (
    <Box
      key={data._id.toString()}
      onClick={handleRecipeClick}
      width={width}
      data-testid={`recipe-box-${data.title}`}
    >
      {image && image.base64Image && (
        <Image
          src={image.base64Image}
          alt={data.title}
          fill
          className="object-cover"
        />
      )}
      {!image && !image?.base64Image && (
        <Image src={logo.src} alt={data.title} fill className="object-cover" />
      )}
      <div
        className="absolute bottom-0 left-0 right-0 p-4 text-white bg-black bg-opacity-50"
        data-testid={`recipe-box-${data.title}`}
      >
        <h3 className="text-lg font-semibold truncate">{data.title}</h3>
      </div>
    </Box>
  );
}
