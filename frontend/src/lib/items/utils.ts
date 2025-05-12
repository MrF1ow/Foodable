
import { Recipe, } from "@/types/recipe";
import {
    GroceryItem,
    GroceryList,
    GroceryListIdentifier,
    GrocerySectionOptions,
} from "@/types/grocery";
import { useGroceryStore } from "@/stores/grocery/store";
import { grocerySections } from "@/config/grocery-sections";
import {
    SavedGroceryMetaData,
    SavedItem,
} from "@/types/saved";
import { FollowMetadata, User } from "@/types/user";

export const getGroceryAccordingItems = (
    accordionCategory: GrocerySectionOptions,
    items: GroceryItem[]
  ) => {
    if (!items) return;
    return items.length === 0
      ? []
      : items.filter((item) => item.category === accordionCategory);
  };
  
export const getAvailableGroceryLists = (
    groceryLists: SavedGroceryMetaData[]
): GroceryListIdentifier[] => {
    if (!groceryLists || groceryLists.length === 0) return [];
    const availableLists: GroceryListIdentifier[] = [];

    groceryLists.forEach((list) => {
        if (list._id !== null) {
            availableLists.push({
                id: list._id.toString(),
                title: list.title,
            });
        }
    });

    return availableLists;
};

export const getCurrentGrocerySections = () => {
    const currentCategories = useGroceryStore((state) => state.currentCategories);

    return grocerySections.filter((section) =>
        currentCategories.some((category) => category === section.title)
    );
};

export const getIsItemSaved = (
    item: Recipe | GroceryList,
    savedItems: SavedItem[]
) => {
    return savedItems.some((savedItem) => savedItem._id === item._id);
};

export const getIsFollowing = (
    item: User,
    following: FollowMetadata[]
) => {
    return following.some((follow) => follow._id === item._id);
};

export const createToMutate = (data: any, listName: string) => {
    let newData;
    if ("instructions" in data) {
        newData = {
            ...data,
            type: "recipe",
            category: listName,
        } as SavedItem;
    } else if ("items" in data) {
        newData = {
            ...data,
            type: "groceryList",
            category: listName,
        } as SavedItem;
    } else {
        newData = {
            ...data,
            category: listName,
        } as SavedItem;
    }
    return newData;
};
