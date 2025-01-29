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
import { grocerySections } from "@/config/grocery-sections";
import { GroceryAccordion } from "@/components/grocery/grocery-accordion";
import { InputCard } from "@/components/input-card/input-card";
import { AddItem } from "@/components/grocery/add-item";
import { HeaderWithButton } from "@/components/header-with-button";
import { AddItemCard } from "./add-item-form";
import { FindPriceCard } from "./find-price-card";
import { HelperCard } from "./list-helper-card";
import { GroceryItem } from "@/types/grocery";

export default function GroceryList() {
  const [items, setItems] = useState(grocerySections.slice(0, 6));

  const column1 = items.filter((_, index) => index % 3 === 0);
  const column2 = items.filter((_, index) => index % 3 === 1);
  const column3 = items.filter((_, index) => index % 3 === 2);
  const [sections, setSections] = useState(grocerySections.slice(0, 4));
  const [splitLayout, setSplitLayout] = useState(false);
  const [currentCard, setCurrentCard] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [openAccordion, setOpenAccordion] = useState<string[]>([]);

  const handleAddItemForm = (title: string) => {
    setSplitLayout(true);
    handleCategoryChange(title);
    setCurrentCard("addItem");
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleFindPriceForm = () => {
    setSplitLayout(true);
    setCurrentCard("findPrice");
  };

  const addItem = (newItem: GroceryItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
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
                    groceryItems={items}
                    setItems={setItems}
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
                    groceryItems={items}
                    setItems={setItems}
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
                      groceryItems={items}
                      setItems={setItems}
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
    );
  };

  const renderRightSideCard = () => {
    switch (currentCard) {
      case "addItem":
        return (
          <AddItemCard
            setSplitLayout={setSplitLayout}
            categories={grocerySections}
            selectedCategory={selectedCategory}
            addItem={addItem}
            handleCategoryChange={handleCategoryChange}
          />
        );
      case "findPrice":
        return <FindPriceCard setSplitLayout={setSplitLayout} />;
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
          buttonText="Find Price"
          handleButtonClick={handleFindPriceForm}
        />
      }
    >
      <ContentLayout split mainContent={<Content />} subContent={<AddItem />} />
      {splitLayout ? (
        <div className="flex h-full w-full">
          <ContentLayout
            split
            leftSide={<Content />}
            rightSide={renderRightSideCard()}
          />
        </div>
      ) : (
        <ContentLayout all={<Content />} />
      )}
    </MainLayout>
  );
}
