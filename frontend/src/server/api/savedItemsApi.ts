import { Recipe } from "@/types/recipe";
import { GroceryList } from "@/types/grocery";

export const SavedItemsApi = {
  // saveItem: async (item: Recipe | GroceryList) => {
  //   try {
  //     const req = {
  //       itemId: item.id,
  //       // @ts-ignore (need to get userId from clerk and stuff later)
  //       userId: item.userId,
  //     };
  //     const response = await axios.post("/saved-items", req);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error saving item:", error);
  //     throw error;
  //   }
  // },
  // removeSavedItem: async (item: Recipe | GroceryList) => {
  //   try {
  //     const req = {
  //       itemId: item.id,
  //       // @ts-ignore (need to get userId from clerk and stuff later)
  //       userId: item.userId,
  //     };
  //     const response = await axios.delete("/saved-items", { data: req });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error removing item:", error);
  //     throw error;
  //   }
  // },
};
