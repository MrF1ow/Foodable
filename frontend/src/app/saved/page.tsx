"use client";

// Local Imports
import { MainLayout } from "@/layouts/main";
import { GeneralHeader } from "@/components/general-header";
import { GeneralAccordion } from "@/components/general-accordion";
import { ContentLayout } from "@/layouts/content";
import { AddButton } from "@/components/saved/add-button";
import { EditButton } from "@/components/saved/edit-button";
import { useSavedItemsStore } from "@/stores/saved/store";

export default function SavedItemsPage() {
  const currentSavedListTitles = useSavedItemsStore(
    (state) => state.currentLists
  );
  const savedItems = useSavedItemsStore((state) => state.savedItems);

  const Content = () => {
    return (
      <>
        {/* Accordion Components */}
        <div className="h-full flex flex-wrap justify-start gap-4 overflow-y-auto">
          {currentSavedListTitles.map((listTitle) => (
            <GeneralAccordion
              key={listTitle}
              title={listTitle}
              content={<div>Recipes</div>}
              width="85%"
              iconSize={40}
              textSize="2rem"
              additional={<EditButton />}
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
