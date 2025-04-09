'use client'

import { useEffect } from "react"
import { useParams } from "next/navigation"

import { useRecipeById } from "@/server/hooks/recipeHooks"
import { getRouteParam } from "@/utils/routeHelpers"
import { useRecipeStore } from "@/stores/recipe/store"
import { useGroceryStore } from "@/stores/grocery/store"
import { getAdditionalIngredients } from "@/utils/listItems"
import { isValidObjectId } from "@/utils/typeValidation/general";

export default function RecipeFetcher() {
    const { id } = useParams();

    const setAdditionalIngredients = useRecipeStore(
        (state) => state.setAdditionalIngredients
    );
    const groceryMap = useGroceryStore((state) => state.map);
    const setCurrentData = useRecipeStore((state) => state.setCurrentRecipe);
    const currentList = useGroceryStore((state) => state.currentList);
    const recipeId = getRouteParam(id);

    if (!recipeId || recipeId === "undefined") {
        console.error("ID is undefined or null");
        return null;
    }

    console.log("Recipe ID:", recipeId);

    useEffect(() => {
        console.log("Recipe ID:", recipeId);
        if (!recipeId) {
            console.error("Recipe ID is null or undefined");
        }
    }, []);

    const { refetchRecipe, recipe, isErrorRecipe, errorRecipe } = useRecipeById(
        recipeId,
        { enabled: !!recipeId && isValidObjectId(recipeId) }
    );

    async function refetchCurrentRecipe() {
        return await refetchRecipe();
    }

    useEffect(() => {
        console.log("ID:", id);
        if (recipeId) {
            refetchCurrentRecipe();
        }
    }, [id, recipeId])

    useEffect(() => {
        if (isErrorRecipe) {
            console.error("Error fetching recipe:", errorRecipe);
        }
        if (recipe && recipe._id) {
            console.log("Recipe fetched successfully:", recipe);
            setCurrentData(recipe);
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

    return <></>
}