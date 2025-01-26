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

interface GroceryAccordionProps {
  handleAddItem: (title: string) => void;
  groceryItems: GroceryItem[];
  setItems: (items: GroceryItem[]) => void;
  openAccordion: string;
  setOpenAccordion: (value: string) => void;
}

export const GroceryAccordion = ({
  title,
  Icon,
  color,
  handleAddItem,
  groceryItems,
  setItems,
  openAccordion,
  setOpenAccordion,
}: GrocerySection & GroceryAccordionProps) => {
  const handleCheckboxChange = (index: number, checked: boolean) => {
    const updatedItems = [...groceryItems];
    updatedItems[index].checked = checked;
    setItems(updatedItems);
  };

  return (
    <Accordion
      type="single"
      className="w-[564px] bg-card-background rounded-lg shadow-lg"
      collapsible
      value={openAccordion}
      onValueChange={(newValue) => setOpenAccordion(newValue)}
    >
      <AccordionItem value={title} className="w-[80%] mx-auto">
        <AccordionTrigger className="flex justify-start items-center space-x-2">
          <AccordionHeader title={title} Icon={Icon} color={color} />
          <div
            style={{
              color: "white",
              backgroundColor: color,
              borderRadius: "50%",
            }}
            onClick={() => handleAddItem?.(title)}
          >
            <Icons.plus />
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="mt-4 flex flex-col gap-x-4">
            {groceryItems.filter((item) => item.section === title).length ===
            0 ? (
              <p className="text-lg text-gray-400">
                No items currently in this section.
              </p>
            ) : (
              groceryItems
                .filter((item) => item.section === title)
                .map((item, index) => (
                  <div key={index} className="flex mb-2 gap-x-4 items-center">
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={(checked: boolean) =>
                        handleCheckboxChange(index, checked)
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
