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
import { Recipe } from "@/types/recipe";
import { GroceryList } from "@/types/grocery";
import { GeneralPopUp } from "@/components/general-popup";
import { validateRecipe } from "@/utils/typeValidation/recipes";
import { isValidObjectId } from "@/utils/typeValidation/general";
import { RecipeBox } from "@/components/recipe/recipe-box";
import { capitalizeTitle } from "@/utils/other";

export default function SavedItemsPage() {
  const sortedSavedItems = useSavedItemsStore(
    (state) => state.sortedSavedItems
  );
  const savedItems = useSavedItemsStore((state) => state.savedItems);
  const currentItem = useSavedItemsStore((state) => state.currentItemIndex);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const togglePopUp = () => {
    setIsOpen(!isOpen);
  };

  const Content = () => {
    return (
      <>
        {isOpen && savedItems[currentItem] && (
          <GeneralPopUp
            toggleDialog={togglePopUp}
            data={savedItems[currentItem].data as Recipe | GroceryList}
          />
        )}
        {/* Accordion Components */}
        <div className="flex flex-wrap justify-start gap-4">
          {sortedSavedItems.map(({ title, items }) => (
            <GeneralAccordion
              key={title}
              title={capitalizeTitle(title)}
              content={
                <div className="space-y-2">
                  {items.length > 0 ? (
                    items.map((item, index) => {
                      const typeOfData = validateRecipe(
                        item.data,
                        isValidObjectId
                      )
                        ? "recipe"
                        : "grocery";

                      console.log("typeOfData", typeOfData);

                      if (typeOfData === "recipe") {
                        return (
                          <RecipeBox
                            key={item.data._id}
                            setOpen={setIsOpen}
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
              width="85%"
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
      <ContentLayout mainContent={<Content />} />
    </MainLayout>
  );
}
