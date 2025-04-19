"use client";

// Local Imports
import SaveItemAccordion from "@/components/page-specific/saved/SaveItemAccordion";
import SaveCategoryEditButton from "@/components/page-specific/saved/SaveCategoryEditButton";
import { useGeneralStore } from "@/stores/general/store";
import { useAllSavedItems } from "@/server/hooks/savedItemsHooks";
import { useRouter } from "next/navigation";

import RecipeBox from "@/components/page-specific/recipe/RecipeBox";
import GroceryBox from "@/components/page-specific/grocery/GroceryBox";
import { capitalizeTitle } from "@/lib/utils/other";
import { SavedItem } from "@/types/saved";
import SavedDataFetcher from "@/components/data-fetchers/SavedDataFetcher";
import GroceryListDataFetcher from "@/components/data-fetchers/GroceryDataFetcher";
import { useSavedItemsStore } from "@/stores/saved/store";
import { FORM_NAMES } from "@/lib/constants/forms";

export default function Saved() {
  const isMobile = useGeneralStore((state) => state.isMobile);

  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const setShowPortal = useGeneralStore((state) => state.setShowPortal);
  const setCurrentForm = useGeneralStore((state) => state.setCurrentForm);

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

  const router = useRouter();

  const handleBoxClick = (data: SavedItem) => {
    setSplitLayout(true);
    setShowPortal(true);
    setCurrentItemType(data.type);
    if (data.type === "recipe") {
      setCurrentForm(FORM_NAMES.RECIPE);
      router.push(`/saved/recipe/${data._id}`);
    } else if (data.type === "groceryList") {
      setCurrentForm(FORM_NAMES.GROCERY_LIST);
      router.push(`/saved/grocery/${data._id}`);
    }
  };

  return (
    <>
      <GroceryListDataFetcher />
      <SavedDataFetcher />

      {/* Accordion Components */}
      <div className="flex flex-col w-full justify-start gap-4">
        {sortedSavedItems.map(({ title, items }) => (
          <SaveItemAccordion
            key={title}
            title={capitalizeTitle(title)}
            content={
              <div className="flex flex-row gap-2 px-2 overflow-x-auto w-full snap-x snap-mandatory">
                {items.length > 0 ? (
                  items.map((item: SavedItem) => {
                    const typeOfData = item.type;

                    if (typeOfData === "recipe") {
                      return (
                        <div
                          key={item._id.toString()}
                          className="flex-shrink-0 min-w-[50px] max-w-[200px] w-full snap-start"
                        >
                          <RecipeBox
                            key={item._id.toString()}
                            handleBoxClick={() => handleBoxClick(item)}
                            data={item}
                            className="w-full"
                          />
                        </div>
                      );
                    } else if (typeOfData === "groceryList") {
                      return (
                        <div
                          key={item._id.toString()}
                          className="flex-shrink-0 min-w-[50px] max-w-[200px] w-full snap-start"
                        >
                          <GroceryBox
                            key={item._id.toString()}
                            handleBoxClick={() => handleBoxClick(item)}
                            data={item}
                            width="w-full"
                          />
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
            iconSize={isMobile ? 20 : 40}
            textSize={isMobile ? "1.5rem" : "2rem"}
            additional={<SaveCategoryEditButton category={title} textSize={isMobile ? "1.5rem" : "2rem"} />}
          />
        ))}
      </div>
    </>
  );
}
