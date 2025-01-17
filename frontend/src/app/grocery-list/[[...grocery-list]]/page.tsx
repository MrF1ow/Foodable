"use client";

// Package Imports
import { Reorder, motion } from "framer-motion";
import { useState } from "react";

// Local Imports
import { ScrollArea } from "@/components/ui/scroll-area";
import { MainLayout } from "@/layouts/main";
import { ContentLayout } from "@/layouts/content";
import { GeneralHeader } from "@/components/general-header";
import { grocerySections } from "@/config/grocery-sections";
import { GroceryAccordion } from "@/components/grocery/grocery-accordion";

export default function GroceryList() {
  const [items, setItems] = useState(grocerySections);
  const [splitLayout, setSplitLayout] = useState(false);

  const Content = () => {
    return (
      <ScrollArea className="w-full h-full">
        <Reorder.Group values={items} onReorder={setItems}>
          <motion.div
            className="flex flex-wrap gap-4 h-full bg-background w-full"
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            dragElastic={0.2}
          >
            {items.map((item) => (
              <Reorder.Item
                value={item}
                key={item.title} // Use index for unique key
                drag
                className="w-full sm:w-1/5 h-auto" // Use responsive widths (1/5 for each item in a row)
                whileDrag={{ scale: 1.05 }}
                dragSnapToGrid={true}
              >
                <GroceryAccordion {...item} />
              </Reorder.Item>
            ))}
          </motion.div>
        </Reorder.Group>
      </ScrollArea>
    );
  };

  const Test = () => {
    return <div>Hello There</div>;
  };

  return (
    <MainLayout
      headerComponent={<GeneralHeader title={"Grocery List"} width="25%" />}
    >
      {splitLayout ? (
        <ContentLayout split leftSide={<Content />} rightSide={<Test />} />
      ) : (
        <ContentLayout all={<Content />} />
      )}
    </MainLayout>
  );
}
