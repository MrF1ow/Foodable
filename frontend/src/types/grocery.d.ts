export interface GrocerySection {
  title: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

export type GroceryItem = {
  name: string; // Ingredient name
  quantity: number; // Quantity of ingredient
};

export type GroceryList = NewGroceryList &
  (
    | { id: string; _id?: never } // If `id` exists, `_id` must not be present
    | { _id: ObjectId; id?: never }
  ); // If `_id` exists, `id` must not be present

export type NewGroceryList = {
  creatorId: ObjectId; // The user ID of the creator
  title: string; // The title of the grocery list
  items: GroceryItem[]; // The items of the grocery list
  timestamp: Date; // The timestamp of the grocery list
};
