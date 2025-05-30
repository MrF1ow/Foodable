"use client";

import { useFetchImageById } from "@/server/hooks/imageHooks";
import { useRecipeById } from "@/server/hooks/recipeHooks";
import { useGroceryStore } from "@/stores/grocery/store";
import { useRecipeStore } from "@/stores/recipe/store";
import { getAdditionalIngredients } from "@/lib/items/ingredients";
import { getRouteParam } from "@/lib/utils/api-helpers";
import { isValidObjectId } from "@/lib/validation/types/general";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import Social from "@/app/(data-hydrate)/social/social";
import SocialPageInjections from "@/components/portal-injections/SocialPageInjections";

export default function Page() {
  const [loading, setLoading] = useState(true);

  const params = useParams<{ id: string }>();
  const id = params.id;
  const recipeId = getRouteParam(id);

  const setAdditionalIngredients = useRecipeStore(
    (state) => state.setAdditionalIngredients
  );
  const groceryMap = useGroceryStore((state) => state.map);
  const setCurrentData = useRecipeStore((state) => state.setCurrentRecipe);
  const setImageUrl = useRecipeStore((state) => state.setCurrentImageUrl);
  const currentData = useRecipeStore((state) => state.currentRecipe);
  const currentList = useGroceryStore((state) => state.currentList);

  const { refetchRecipe, recipe, isErrorRecipe, errorRecipe } = useRecipeById(
    recipeId as string,
    { enabled: !!recipeId && isValidObjectId(recipeId) }
  );

  const { refetchImage } = useFetchImageById(
    currentData?.imageId ? currentData?.imageId.toString() : "",
    {
      enabled: !!currentData?.imageId && isValidObjectId(currentData?.imageId),
    }
  );

  useEffect(() => {
    if (!recipeId || recipeId === "undefined") {
      console.error("Invalid recipeId");
      return;
    }

    if (currentData && currentData._id.toString() === recipeId) {
      console.log("Loaded from Zustand, skipping refetch");
      setLoading(false);
      return;
    }

    setLoading(true); // start loading when the page mounts

    refetchRecipe().then((response) => {
      if (response.data) {
        setCurrentData(response.data);
      } else {
        console.error("Error fetching recipe:", response.error);
      }
    });
  }, []);

  useEffect(() => {
    if (isErrorRecipe) {
      console.error("Error fetching recipe:", errorRecipe);
    }

    const imageId = currentData?.imageId;

    if (imageId && isValidObjectId(imageId)) {
      refetchImage().then((response) => {
        if (response.data) {
          setImageUrl(response.data.base64Image);
        } else {
          console.error("Error fetching image:", response.error);
        }
        setLoading(false); // done loading once image is fetched
      });
    } else {
      console.warn("Invalid or missing imageId, skipping refetch.");
      setLoading(false); // done loading if no image to fetch
    }

    if (recipe) {
      const additionalIngredients = getAdditionalIngredients(
        recipe.ingredients,
        groceryMap
      );
      setAdditionalIngredients(additionalIngredients);
    }
  }, [recipe, currentList]);

  if (loading || !currentData) {
    return <Spinner />;
  }

  return (
    <>
      <Social />
      <SocialPageInjections />
    </>
  );
}
