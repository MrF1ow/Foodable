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
import { InputCard } from "@/components/input-card/input-card";
import { AddItem } from "@/components/grocery/add-item";

export default function GroceryList() {
  const [items, setItems] = useState(grocerySections.slice(0, 6));

  const column1 = items.filter((_, index) => index % 3 === 0);
  const column2 = items.filter((_, index) => index % 3 === 1);
  const column3 = items.filter((_, index) => index % 3 === 2);

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
                  <GroceryAccordion {...item} />
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
                  <GroceryAccordion {...item} />
                </Reorder.Item>
              ))}
            </div>

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
                  <GroceryAccordion {...item} />
                </Reorder.Item>
              ))}
            </div>
          </motion.div>
        </Reorder.Group>
      </ScrollArea>
    );
  };

  return (
    <MainLayout
      headerComponent={<GeneralHeader title={"Grocery List"} width="25%" />}
    >
      <ContentLayout split mainContent={<Content />} subContent={<AddItem />} />
    </MainLayout>
  );
}
