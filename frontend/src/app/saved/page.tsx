"use client";

import { useState } from "react";

// Local Imports
import { MainLayout } from "@/layouts/main";
import { GeneralHeader } from "@/components/general-header";
import { GeneralAccordion } from "@/components/general-accordion";
import { ContentLayout } from "@/layouts/content";
import { AddButton } from "@/components/saved/add-button";
import { EditButton } from "@/components/saved/edit-button";
import { useSavedItemsStore } from "@/stores/saved/store";
import { useGeneralStore } from "@/stores/general/store";
import { Recipe } from "@/types/recipe";
import { GroceryList } from "@/types/grocery";
import { GeneralPopUp } from "@/components/general-popup";
import { validateRecipe } from "@/utils/typeValidation/recipes";
import { isValidObjectId } from "@/utils/typeValidation/general";
import { RecipeBox } from "@/components/recipe/recipe-box";
import { capitalizeTitle } from "@/utils/other";

export default function SavedItemsPage() {
  const isMobile = useGeneralStore((state) => state.isMobile);
  const sortedSavedItems = useSavedItemsStore(
    (state) => state.sortedSavedItems
  );
  const splitLayout = useGeneralStore((state) => state.splitLayout);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const savedItems = useSavedItemsStore((state) => state.savedItems);
  const currentItem = useSavedItemsStore((state) => state.currentItemIndex);
  const setItemIndex = useSavedItemsStore((state) => state.setCurrentItemIndex);

  const togglePopUp = () => {
    setSplitLayout(!splitLayout);
  };

  const renderRightSideCard = () => {
    return (
      <>
        {splitLayout && savedItems[currentItem] && (
          <GeneralPopUp
            toggleDialog={togglePopUp}
            data={savedItems[currentItem].data as Recipe | GroceryList}
          />
        )}
      </>
    );
  };

  const Content = () => {
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
                    items.map((item, index) => {
                      const dataToPass = {
                        ...item.data,
                        timestamp: new Date(item.data.timestamp),
                      };
                      const typeOfData = validateRecipe(
                        dataToPass,
                        isValidObjectId
                      )
                        ? "recipe"
                        : "grocery";

                      console.log("typeOfData", typeOfData);
                      console.log("item", item);

                      if (typeOfData === "recipe") {
                        return (
                          <RecipeBox
                            key={item.data._id}
                            setOpen={setSplitLayout}
                            setIndexOfRecipe={setItemIndex}
                            indexOfRecipe={index}
                          />
                        );
                      } else {
                        return (
                          <div
                            key={item.data._id}
                            className="p-2 border rounded-lg"
                          >
                            {item.data.title}
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
  };

  return (
    <MainLayout
      headerComponent={<GeneralHeader title={"Saved Items"} width="25%" />}
    >
      <ContentLayout
        split={splitLayout}
        mainContent={<Content />}
        subContent={renderRightSideCard()}
      />
    </MainLayout>
  );
}
