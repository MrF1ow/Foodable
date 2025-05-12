'use client';

import { useFetchImageById } from "@/server/hooks/imageHooks";
import { useRecipeById } from "@/server/hooks/recipeHooks";
import { useGeneralStore } from "@/stores/general/store";
import { useGroceryStore } from "@/stores/grocery/store";
import { useRecipeStore } from "@/stores/recipe/store";
import { getAdditionalIngredients } from "@/lib/items/ingredients";
import { getRouteParam } from "@/lib/utils/api-helpers";
import { isValidObjectId } from "@/lib/validation/types/general";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Saved from "../../saved";
import SavePageInjections from "@/components/portal-injections/SavePageInjections";
import Spinner from "@/components/Spinner"

export default function Page() {
    const [loading, setLoading] = useState(true);

    const params = useParams<{ id: string }>();
    const id = params.id;
    const recipeId = getRouteParam(id);

    const setAdditionalIngredients = useRecipeStore(state => state.setAdditionalIngredients);
    const groceryMap = useGroceryStore(state => state.map);
    const setCurrentData = useRecipeStore(state => state.setCurrentRecipe);
    const setImageUrl = useRecipeStore(state => state.setCurrentImageUrl);
    const setSplitLayout = useGeneralStore(state => state.setSplitLayout);
    const currentData = useRecipeStore(state => state.currentRecipe);
    const currentList = useGroceryStore(state => state.currentList);

    const { refetchRecipe, recipe, isErrorRecipe, errorRecipe } = useRecipeById(
        recipeId as string,
        { enabled: !!recipeId && isValidObjectId(recipeId) }
    );

    const { refetchImage } = useFetchImageById(currentData?.imageId?.toString()!, {
        enabled: !!currentData?.imageId && isValidObjectId(currentData?.imageId),
    });

    useEffect(() => {
        if (!recipeId || recipeId === "undefined") {
            console.error("Invalid recipeId");
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

        setSplitLayout(true);
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
            <Saved />
            <SavePageInjections />
        </>
    );
}
