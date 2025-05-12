import { FollowMetadata } from "@/types/user";
import { compareTag } from "../utils/recipe-tags";
import { RecipeMetaData, SavedGroceryMetaData, SavedRecipeMetaData } from "@/types/saved";
import { FilterOptions } from "@/types";

export const filterRecipes = (
    recipes: RecipeMetaData[],
    filter: FilterOptions
): RecipeMetaData[] => {
    let filteredRecipes = [...recipes];

    // Filter by search query
    if (filter.searchQuery) {
        filteredRecipes = filteredRecipes.filter((recipe) =>
            recipe.title.toLowerCase().includes(filter.searchQuery.toLowerCase())
        );
    }

    // Sorting function
    filteredRecipes.sort((a, b) => {
        let result = 0;

        if (filter.timeApprox !== 0) {
            result = compareTag(a.tags.time, b.tags.time, filter.timeApprox);
        }
        if (result === 0 && filter.price !== 0) {
            result = compareTag(a.tags.price, b.tags.price, filter.price);
        }
        if (result === 0 && filter.ingredientAmount !== 0) {
            result = compareTag(
                a.tags.ingredient,
                b.tags.ingredient,
                filter.ingredientAmount
            );
        }

        return result;
    });

    return filteredRecipes;
};

export const filterUsers = (users: FollowMetadata[], searchQuery: string) => {
    return users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
};

export const filterSavedItems = (
    savedItems: SavedRecipeMetaData[] | SavedGroceryMetaData[],
    searchQuery: string
) => {
    return savedItems.filter((savedItem) =>
        savedItem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
};