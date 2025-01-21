"use client";

// Local Imports
import { MainLayout } from "@/layouts/main";
import { GeneralHeader } from "@/components/general-header";
import { GeneralAccordion } from "@/components/general-accordion";
import { ContentLayout } from "@/layouts/content";
import { AddButton } from "@/components/saved/add-button";

export default function SavedItemsPage() {
  const Content = () => {
    return (
      <>
        {/* Accordion Components */}
        <div className="h-full flex flex-wrap justify-start gap-4 overflow-y-auto">
          <GeneralAccordion
            title="Favorites"
            content={<div>Recipes</div>}
            width="85%"
            iconSize={40}
            textSize="2rem"
          />
          <GeneralAccordion
            title="Desserts"
            content={<div>Ingredients</div>}
            width="85%"
            iconSize={40}
            textSize="2rem"
          />
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
      <ContentLayout all={<Content />} />
    </MainLayout>
  );
}
