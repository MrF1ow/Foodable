import { GroceryList, Recipe } from ".";

export type SavedItem = {
    category: string;
    data: Recipe | GroceryList;
};