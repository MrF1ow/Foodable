"use client";

// Local Imports
import { GeneralAccordion } from "@/components/general-accordion";
import { AddButton } from "@/components/common/saved/add-button";
import { EditButton } from "@/components/common/saved/edit-button";
import { useGeneralStore } from "@/stores/general/store";
import { useAllSavedItems } from "@/server/hooks/savedItemsHooks";

import { RecipeBox } from "@/components/common/recipe/recipe-box";
import { GroceryBox } from "@/components/common/grocery/grocery-box";
import { capitalizeTitle } from "@/utils/other";
import { SavedItem } from "@/types/saved";
import SavedDataFetcher from "@/components/common/saved/saved-data-fetcher";
import GroceryListDataFetcher from "@/components/common/grocery/grocery-list-data-fetcher";
import { useSavedItemsStore } from "@/stores/saved/store";

export default function Saved() {
  const isMobile = useGeneralStore((state) => state.isMobile);

  const splitLayout = useGeneralStore((state) => state.splitLayout);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);

  const currentCategories = useSavedItemsStore(
    (state) => state.currentCategories
  );
  const setCurrentItemType = useSavedItemsStore(
    (state) => state.setCurrentItemType
  );

  const { savedItems } = useAllSavedItems({
    enabled: true,
  });

  const sortedSavedItems = currentCategories.map((category) => {
    const recipeItems = savedItems.recipes.filter(
      (item: SavedItem) => item.category === category
    );

    const groceryItems = savedItems.groceryLists.filter(
      (item: SavedItem) => item.category === category
    );

    return { title: category, items: [...recipeItems, ...groceryItems] };
  });

  return (
    <>
      <GroceryListDataFetcher />
      <SavedDataFetcher />
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
                    } else if (typeOfData === "groceryList") {
                      return (
                        <GroceryBox
                          key={item._id.toString()}
                          setOpen={(split: boolean) => {
                            setSplitLayout(split);
                            setCurrentItemType("groceryList");
                          }}
                          data={item}
                        />
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
