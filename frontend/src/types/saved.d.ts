import { GroceryList, Recipe } from ".";

export interface SavedCategory {
  title: string;
  items: SavedItem[];
}

export type SavedItem = {
  category: string;
  data: Recipe | GroceryList;
};
