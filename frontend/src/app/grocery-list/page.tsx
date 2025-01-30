"use client";

// Package Imports
import { Reorder, motion } from "framer-motion";
import { useState } from "react";

// Local Imports
import { ScrollArea } from "@/components/ui/scroll-area";
import { MainLayout } from "@/layouts/main";
import { ContentLayout } from "@/layouts/content";
import { GeneralHeader } from "@/components/general-header";
import {
  grocerySections,
  grocerySectionOptions,
} from "@/config/grocery-sections";
import { GroceryAccordion } from "@/components/grocery/grocery-accordion";
import { HeaderWithButton } from "@/components/header-with-button";
import { AddItem } from "../../components/grocery/add-item";
import { FindPrice as FindPrice } from "../../components/grocery/find-price";
import { HelperCard } from "../../components/grocery/list-helper";
import { GroceryItem } from "@/types/grocery";
import { useGroceryStore } from "@/stores/grocery/store";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

export default function GroceryList() {
  const [sections, setSections] = useState(grocerySections);
  const [splitLayout, setSplitLayout] = useState(false);
  const [currentCard, setCurrentCard] = useState("");
  const [openAccordion, setOpenAccordion] = useState<string[]>([]);
  const handleCategoryChange = useGroceryStore(
    (state) => state.setSelectedCategory
  );
  const groceryItems = useGroceryStore((state) => state.items);
  const setItems = useGroceryStore((state) => state.setItems);

  const handleAddItemForm = (title: string) => {
    setSplitLayout(true);
    handleCategoryChange(title);
    setCurrentCard("addItem");
  };

  const handleFindPriceForm = () => {
    setSplitLayout(true);
    setCurrentCard("findPrice");
  };

  const handleHelperForm = () => {
    setSplitLayout(true);
    setCurrentCard("groceryHelper");
  };

  const handleItemDeletion = () => {
    const uncheckedItems = groceryItems.filter((item) => !item.checked);

    setItems(uncheckedItems);
  };

  let column1, column2, column3;

  if (splitLayout == false) {
    column1 = sections.filter((_, index) => index % 3 === 0);
    column2 = sections.filter((_, index) => index % 3 === 1);
    column3 = sections.filter((_, index) => index % 3 === 2);
  } else {
    column1 = sections.filter((_, index) => index % 2 === 0);
    column2 = sections.filter((_, index) => index % 2 === 1);
    column3 = undefined;
  }

  const Content = () => {
    return (
      <div>
        <ScrollArea className="w-full h-full">
          <Reorder.Group values={sections} onReorder={setSections}>
            <motion.div
              className="flex flex-wrap gap-4 h-full bg-background w-full"
              dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
              dragElastic={0.2}
            >
              <div className="flex flex-col gap-4">
                {column1.map((item) => (
                  <Reorder.Item
                    value={item}
                    key={item.title} // Use index for unique key
                    drag
                    className="w-full sm:w-1/5 h-auto" // Use responsive widths (1/5 for each item in a row)
                    whileDrag={{ scale: 1.05 }}
                    dragSnapToGrid={true}
                  >
                    <GroceryAccordion
                      {...item}
                      handleAddItem={handleAddItemForm}
                      setOpenAccordion={setOpenAccordion}
                      openAccordion={openAccordion}
                    />
                  </Reorder.Item>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                {column2.map((item) => (
                  <Reorder.Item
                    value={item}
                    key={item.title} // Use index for unique key
                    drag
                    className="w-full sm:w-1/5 h-auto" // Use responsive widths (1/5 for each item in a row)
                    whileDrag={{ scale: 1.05 }}
                    dragSnapToGrid={true}
                  >
                    <GroceryAccordion
                      {...item}
                      handleAddItem={handleAddItemForm}
                      setOpenAccordion={setOpenAccordion}
                      openAccordion={openAccordion}
                    />
                  </Reorder.Item>
                ))}
              </div>
              {column3 && (
                <div className="flex flex-col gap-4">
                  {column3.map((item) => (
                    <Reorder.Item
                      value={item}
                      key={item.title} // Use index for unique key
                      drag
                      className="w-full sm:w-1/5 h-auto" // Use responsive widths (1/5 for each item in a row)
                      whileDrag={{ scale: 1.05 }}
                      dragSnapToGrid={true}
                    >
                      <GroceryAccordion
                        {...item}
                        handleAddItem={handleAddItemForm}
                        setOpenAccordion={setOpenAccordion}
                        openAccordion={openAccordion}
                      />
                    </Reorder.Item>
                  ))}
                </div>
              )}
            </motion.div>
          </Reorder.Group>
        </ScrollArea>
        {!splitLayout && (
          <Button
            className="btn-primary rounded-full w-12 h-12 hover:bg-green-500 flex items-center justify-center fixed bottom-4 right-4 z-50"
            onClick={handleHelperForm}
          >
            <Icons.ai className="!w-6 !h-6" />
          </Button>
        )}
      </div>
    );
  };

  const renderRightSideCard = () => {
    switch (currentCard) {
      case "addItem":
        return (
          <AddItem
            setSplitLayout={setSplitLayout}
            categories={grocerySections}
          />
        );
      case "findPrice":
        return <FindPrice setSplitLayout={setSplitLayout} />;
      case "groceryHelper":
        return <HelperCard setSplitLayout={setSplitLayout} />;
      default:
        return null;
    }
  };

  return (
    <MainLayout
      headerComponent={
        <HeaderWithButton
          title={"Grocery List"}
          width="25%"
          children={
            <div className="flex items-center justify-center">
              <Button
                onClick={handleItemDeletion}
                className="mx-6 p-6 bg-destructive rounded-md hover:scale-105 hover:shadow-lg transition-all"
              >
                <Icons.delete className="!h-6 !w-6" />
              </Button>
              <Button
                onClick={handleFindPriceForm}
                className="text-2xl p-6 bg-primary font-bold rounded-md hover:scale-105 hover:shadow-lg transition-all"
              >
                {"Find Price"}
              </Button>
            </div>
          }
        />
      }
    >
      {splitLayout ? (
        <div className="flex h-full w-full">
          <ContentLayout
            split
            mainContent={<Content />}
            subContent={renderRightSideCard()}
          />
        </div>
      ) : (
        <ContentLayout mainContent={<Content />} />
      )}
    </MainLayout>
  );
}
