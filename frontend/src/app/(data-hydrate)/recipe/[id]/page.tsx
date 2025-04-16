'use client'

import RecipePopUp from "@/components/popups/RecipePopup";
import { useFetchImageById } from "@/server/hooks/imageHooks";
import { useRecipeById } from "@/server/hooks/recipeHooks";
import { useGroceryStore } from "@/stores/grocery/store";
import { useRecipeStore } from "@/stores/recipe/store";
import { getAdditionalIngredients } from "@/lib/utils/listItems";
import { getRouteParam } from "@/lib/utils/routeHelpers";
import { isValidObjectId } from "@/lib/utils/typeValidation/general";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import RecipePageInjections from "@/components/portal-injections/RecipePageInjections";
import { Router } from "lucide-react";

export default function Page() {
    const params = useParams<{ id: string }>();
    const id = params.id;
    const recipeId = getRouteParam(id);

    const [renderComponent, setRenderComponent] = useState(false);

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

    const { refetchImage } = useFetchImageById(currentData?.imageId as string, {
        enabled: !!currentData?.imageId && isValidObjectId(currentData?.imageId),
    });

    useEffect(() => {
        if (!recipeId || recipeId === "undefined") {
            console.error("Invalid recipeId");
            return;
        }

        refetchRecipe().then((response) => {
            if (response.data) {
                setCurrentData(response.data);
                setRenderComponent(true);
                const additionalIngredients = getAdditionalIngredients(
                    response.data.ingredients,
                    groceryMap
                );
                setAdditionalIngredients(additionalIngredients);
            } else {
                console.error("Error fetching recipe:", response.error);
            }
        });
    });

    useEffect(() => {
        if (!currentData) return;

        const imageId = currentData.imageId;
        if (imageId && isValidObjectId(imageId)) {
            refetchImage().then((response) => {
                if (response.data) {
                    setImageUrl(response.data.base64Image);
                } else {
                    console.error("Error fetching image:", response.error);
                }
            });
        } else {
            console.warn("Invalid or missing imageId, skipping refetch.");
        }
    }, [currentData]);

    useEffect(() => {
        if (currentList) {
            if (currentData) {
                if ('ingredients' in currentData) {
                    const additionalIngredients = getAdditionalIngredients(
                        currentData?.ingredients,
                        groceryMap
                    );
                    setAdditionalIngredients(additionalIngredients);
                }
            }
        }

    }, [currentList]);

    if (!currentData) return null;

    if (!renderComponent) return null;

    return (
        <>
            <RecipePopUp />
            <RecipePageInjections />
        </>
    );
}