"use client";

// Local Imports
import GeneralAccordion from "@/components/GeneralAccordion";
import SaveCategoryAddButton from "@/components/page-specific/saved/SaveCategoryAddButton";
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
import SavePageInjections from "@/components/portal-injections/SavePageInjections";
import { FORM_NAMES } from "@/lib/constants/forms";

export default function Saved() {
  const isMobile = useGeneralStore((state) => state.isMobile);

  const splitLayout = useGeneralStore((state) => state.splitLayout);
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
                          handleBoxClick={() => handleBoxClick(item)}
                          data={item}
                        />
                      );
                    } else if (typeOfData === "groceryList") {
                      return (
                        <GroceryBox
                          key={item._id.toString()}
                          handleBoxClick={() => handleBoxClick(item)}
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
            additional={<SaveCategoryEditButton category={title} />}
          />
        ))}
      </div>

      {/* Add Button */}
      <SaveCategoryAddButton />
    </>
  );
}
