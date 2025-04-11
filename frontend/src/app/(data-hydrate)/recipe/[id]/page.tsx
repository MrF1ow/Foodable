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
import { useEffect } from "react";
import RecipePageInjections from "@/components/portal-injections/RecipePageInjections";

export default function Page() {
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

    const { refetchImage } = useFetchImageById(currentData?.imageId as string, {
        enabled: !!currentData?.imageId && isValidObjectId(currentData?.imageId),
    });

    useEffect(() => {
        console.log("RecipeFetcher - useEffect - recipeId:", recipeId);
        if (!recipeId || recipeId === "undefined") {
            console.error("Invalid recipeId");
            return;
        }

        refetchRecipe().then((response) => {
            if (response.data) {
                console.log("Recipe fetched successfully:", response.data);
                setCurrentData(response.data);
            } else {
                console.error("Error fetching recipe:", response.error);
            }
        });
    });

    useEffect(() => {
        if (isErrorRecipe) {
            console.error("Error fetching recipe:", errorRecipe);
        }
        const imageId = currentData?.imageId;
        // only refetch if imageId is valid
        if (imageId && isValidObjectId(imageId)) {
            refetchImage().then((response) => {
                if (response.data) {
                    console.log("Image fetched successfully:", response.data);
                    setImageUrl(response.data.base64Image);
                } else {
                    console.error("Error fetching image:", response.error);
                }
            });
        } else {
            console.warn("Invalid or missing imageId, skipping refetch.");
        }
        if (recipe) {
            const additionalIngredients = getAdditionalIngredients(
                recipe.ingredients,
                groceryMap
            );
            console.log("Additional Ingredients:", additionalIngredients);
            setAdditionalIngredients(additionalIngredients);
        }

    }, [recipe, currentList]);

    if (!currentData) return null;

    return (<><RecipePopUp /><RecipePageInjections /></>);
}