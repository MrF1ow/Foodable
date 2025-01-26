"use client";

// Package Imports
import { Reorder, motion } from "framer-motion";
import { useState } from "react";

// Local Imports
import { ScrollArea } from "@/components/ui/scroll-area";
import { MainLayout } from "@/layouts/main";
import { ContentLayout } from "@/layouts/content";
import { grocerySections } from "@/config/grocery-sections";
import { GroceryAccordion } from "@/components/grocery/grocery-accordion";
import { HeaderWithButton } from "@/components/header-with-button";
import { AddItemCard } from "./add-item-form";
import { FindPriceCard } from "./find-price-card";
import { HelperCard } from "./list-helper-card";

export default function GroceryList() {
  const [items, setItems] = useState(grocerySections);
  const [splitLayout, setSplitLayout] = useState(false);
  const [currentCard, setCurrentCard] = useState("");
  const [selectedTitle, setSelectedTitle] = useState("");

  const handleAddItem = (title: string) => {
    setSplitLayout(true);
    setSelectedTitle(title);
    setCurrentCard("addItem");
    console.log("Add item button clicked");
    console.log(selectedTitle);
  };

  const handleFindPrice = () => {
    setSplitLayout(true);
    setCurrentCard("findPrice");
    console.log("Find Price button clicked");
  };
  let column1, column2, column3;

  if (splitLayout == false) {
    column1 = items.filter((_, index) => index % 3 === 0);
    column2 = items.filter((_, index) => index % 3 === 1);
    column3 = items.filter((_, index) => index % 3 === 2);
  } else {
    column1 = items.filter((_, index) => index % 2 === 0);
    column2 = items.filter((_, index) => index % 2 === 1);
    column3 = undefined;
  }

  const Content = () => {
    return (
      <ScrollArea className="w-full h-full">
        <Reorder.Group values={items} onReorder={setItems}>
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
                  <GroceryAccordion {...item} handleAddItem={handleAddItem} />
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
                  <GroceryAccordion {...item} handleAddItem={handleAddItem} />
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
                    <GroceryAccordion {...item} handleAddItem={handleAddItem} />
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
            selectedCategory={selectedTitle}
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
          handleButtonClick={handleFindPrice}
        />
      }
    >
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
