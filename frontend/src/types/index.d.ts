import { ObjectId } from "mongodb";

export type Units =
  | "pcs"
  | "kg"
  | "g"
  | "l"
  | "ml"
  | "tbsp"
  | "tsp"
  | "lb"
  | "oz"
  | "cup"
  | "pint"
  | "quart"
  | "gallon";

export interface UnitConversions {
  [key: string]: {
    [key in Units]?: number; // Optional number for each unit conversion
  };
}

export interface useQueryProps {
  filterObject?: any;
  active?: boolean;
  enabled: boolean;
}

export interface FilterOptions {
  searchQuery: string;
  // -1 is descending, 0 is no sorting, 1 is ascending
  timeApprox: -1 | 0 | 1;
  price: -1 | 0 | 1;
  ingredientAmount: -1 | 0 | 1;
}

export type Tag = 1 | 2 | 3 | 4 | 5;

export interface FilterTag {
  time: Tag;
  price: Tag;
  ingredient: Tag;
}

export type UserSections = "following" | "followers";

export type SavedSections = 'recipes' | 'groceryLists';

export type CollectionNames = "recipes" | "users" | "groceryLists" | "vectors"
