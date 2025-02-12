"use client";

// Local Imports
import { MainLayout } from "@/layouts/main";
import { GeneralHeader } from "@/components/general-header";
import { GeneralAccordion } from "@/components/general-accordion";
import { ContentLayout } from "@/layouts/content";
import { AddButton } from "@/components/saved/add-button";
import { EditButton } from "@/components/saved/edit-button";
import { useSavedItemsStore } from "@/stores/saved/store";
import { useGeneralStore } from "@/stores/general/store";
import { GeneralPopUp } from "@/components/general-popup";
import { RecipeBox } from "@/components/recipe/recipe-box";
import { capitalizeTitle } from "@/utils/other";

export default function SavedItemsPage() {
  const isMobile = useGeneralStore((state) => state.isMobile);
  const sortedSavedItems = useSavedItemsStore(
    (state) => state.sortedSavedItems
  );
  const splitLayout = useGeneralStore((state) => state.splitLayout);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const setItemIndex = useSavedItemsStore((state) => state.setCurrentItemId);
  const currentType = useSavedItemsStore((state) => state.currentItemType);
  const data = useSavedItemsStore((state) => state.currentItem);
  const cacheFullData = useSavedItemsStore((state) => state.cacheFullData);

  const togglePopUp = () => {
    setSplitLayout(!splitLayout);
  };

  const renderRightSideCard = () => {
    return (
      <>
        {splitLayout && currentType && data && (
          <GeneralPopUp
            toggleDialog={togglePopUp}
            typeOfData={currentType}
            data={data}
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
                    items.map((item) => {
                      const typeOfData = item.type;

                      if (typeOfData === "recipe") {
                        return (
                          <RecipeBox
                            key={item._id.toString()}
                            setOpen={setSplitLayout}
                            setId={setItemIndex}
                            recipeId={item._id.toString()}
                            fetchAndStore={cacheFullData}
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
