import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GrocerySection, GroceryItem } from "@/types/grocery";
import { AccordionHeader } from "./accordion-header";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Icons } from "../ui/icons";
import { useGroceryStore } from "@/stores/grocery/store";

interface GroceryAccordionProps {
  handleAddItem: (title: string) => void;
  openAccordion: string[];
  setOpenAccordion: (value: string[]) => void;
}

export const GroceryAccordion = ({
  title,
  Icon,
  color,
  handleAddItem,
  openAccordion,
  setOpenAccordion,
}: GrocerySection & GroceryAccordionProps) => {
  const setItems = useGroceryStore((state) => state.setItems);
  const groceryItems = useGroceryStore((state) => state.items);

  const handleCheckboxChange = (
    section: string,
    id: string,
    checked: boolean
  ) => {
    const updatedItems = groceryItems.map((item) => {
      if (item.category === section && item.id === id) {
        return { ...item, checked };
      }
      return item;
    });
    setItems(updatedItems);
  };

  return (
    <Accordion
      type="multiple"
      className="bg-card-background rounded-lg shadow-lg"
      value={openAccordion}
      onValueChange={(newValue) => setOpenAccordion(newValue)}
    >
      <AccordionItem
        value={title}
        className="w-[90%] md:w-[80%] max-w-[560px] mx-auto"
      >
        <AccordionTrigger className="flex items-center md:space-x-2 hover:no-underline hover:scale-105">
          <AccordionHeader title={title} Icon={Icon} color={color} />
          <div
            style={{
              color: "white",
              backgroundColor: color,
              borderRadius: "50%",
            }}
            onClick={() => handleAddItem?.(title)}
            className="transition-all hover:scale-125"
          >
            <Icons.plus />
          </div>
        </AccordionTrigger>

        <AccordionContent className="max-h-80 overflow-y-auto">
          <div className="mt-4 flex flex-col gap-x-4">
            {groceryItems.filter((item) => item.category === title).length ===
            0 ? (
              <p className="text-lg text-gray-400">
                No items currently in this section.
              </p>
            ) : (
              groceryItems
                .filter((item) => item.category === title)
                .map((item) => (
                  <div key={item.id} className="flex mb-2 gap-x-4 items-center">
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={(checked: boolean) =>
                        handleCheckboxChange(title, item.id, checked)
                      }
                    />
                    <p className="text-lg">{item.name}</p>
                    <p className="bg-background text-foreground text-xs rounded-md p-1">
                      {item.quantity} pcs
                    </p>
                  </div>
                ))
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
