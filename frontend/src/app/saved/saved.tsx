"use client";

// Local Imports
import { GeneralAccordion } from "@/components/general-accordion";
import { AddButton } from "@/components/common/saved/add-button";
import { EditButton } from "@/components/common/saved/edit-button";
import { useGeneralStore } from "@/stores/general/store";
import { useAllSavedItems } from "@/server/hooks/savedItemsHooks";

import { RecipeBox } from "@/components/common/recipe/recipe-box";
import { capitalizeTitle } from "@/utils/other";
import { SavedItem } from "@/types/saved";
import { useEffect } from "react";
import { useSavedItemsStore } from "@/stores/saved/store";

export default function Saved() {
  const isMobile = useGeneralStore((state) => state.isMobile);

  const splitLayout = useGeneralStore((state) => state.splitLayout);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);

  const setCurrentCategories = useSavedItemsStore(
    (state) => state.setCurrentCategories
  );
  const currentCategories = useSavedItemsStore(
    (state) => state.currentCategories
  );
  const setCurrentItemType = useSavedItemsStore(
    (state) => state.setCurrentItemType
  );

  const { savedItems } = useAllSavedItems({
    enabled: true,
  });

  useEffect(() => {
    console.log(savedItems);
    if (savedItems) {
      let categories: string[] = [];

      // Process recipes if not empty
      if (savedItems.recipes.length !== 0) {
        const recipeCategories = savedItems.recipes.reduce(
          (acc: string[], item: SavedItem) => {
            if (item.category && !acc.includes(item.category)) {
              acc.push(item.category);
            }
            return acc;
          },
          []
        );
        categories = [...categories, ...recipeCategories];
      }

      // Process groceryLists if not empty
      if (savedItems.groceryLists.length !== 0) {
        const groceryCategories = savedItems.groceryLists.reduce(
          (acc: string[], item: SavedItem) => {
            if (item.category && !acc.includes(item.category)) {
              acc.push(item.category);
            }
            return acc;
          },
          []
        );
        categories = [...categories, ...groceryCategories];
      }

      // Remove duplicates and update state
      setCurrentCategories([...new Set(categories)]);
    }
  }, [savedItems]);

  const sortedSavedItems = currentCategories.map((category) => {
    const recipeItems = savedItems.recipes.filter(
      (item: SavedItem) => item.category === category
    );

    const groceryItems = savedItems.groceryLists.filter(
      (item: SavedItem) => item.category === category
    );

    return { title: category, items: [...recipeItems, ...groceryItems] };
  });

  console.log(sortedSavedItems);

  return (
    <>
      {/* Accordion Components */}
      <div className="flex flex-wrap justify-start gap-4">
        {sortedSavedItems.map(({ title, items }) => (
          <GeneralAccordion
            key={title}
            title={capitalizeTitle(title)}
            content={
              <div className="flex flex-row items-center w-full space-x-2 overflow-x-auto">
                {items.length > 0 ? (
                  items.map((item: SavedItem) => {
                    const typeOfData = item.type;

                    if (typeOfData === "recipe") {
                      return (
                        <RecipeBox
                          key={item._id.toString()}
                          setOpen={(split: boolean) => {
                            setSplitLayout(split);
                            setCurrentItemType("recipe");
                          }}
                          data={item}
                        />
                      );
                    } else if (typeOfData === "grocery") {
                      return (
                        <div
                          key={item._id.toString()}
                          className="p-2 border rounded-lg"
                        >
                          {item.title}
                        </div>
                      );
                    }
                  })
                ) : (
                  <div className="text-gray-500 italic">
                    No items saved in this category.
                  </div>
                )}
              </div>
            }
            width={isMobile ? (splitLayout ? "100%" : "85%") : "85%"}
            iconSize={40}
            textSize="2rem"
            additional={<EditButton category={title} />}
          />
        ))}
      </div>

      {/* Add Button */}
      <AddButton />
    </>
  );
}
