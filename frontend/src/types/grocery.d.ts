export type GrocerySectionOptions =
  | "Bakery"
  | "Dairy"
  | "Produce"
  | "Meat"
  | "Pantry"
  | "Frozen"
  | "Snacks"
  | "Beverages"
  | "Baby"
  | "Household"
  | "Seafood"
  | "Personal Care"
  | "Pet"
  | "Alcohol"
  | "Sweets";

export interface GrocerySection {
  title: GrocerySectionOptions;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

export interface GroceryListIdentifier {
  title: string;
  id: string;
}

export interface GroceryItem {
  name: string;
  quantity: number;
  unit: Units;
  category: GrocerySectionOptions;
  checked: boolean;
}

export type GroceryList = NewGroceryList & { _id: ObjectId };

export type NewGroceryList = {
  _id: null;
  creatorId: ObjectId; // The user ID of the creator
  title: string; // The title of the grocery list
  items: GroceryItem[]; // The items of the grocery list
  timestamp?: Date; // The timestamp of the grocery list
};
