import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";
import {
  GrocerySection,
  GroceryItem,
  GrocerySectionOptions,
} from "@/types/grocery";
import { AccordionHeader } from "./accordion-header";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "../ui/icons";
import { useGroceryStore } from "@/stores/grocery/store";
import { useGeneralStore } from "@/stores/general/store";
import { getGroceryAccordingItems } from "@/utils/listItems";
import { useRecipeStore } from "@/stores/recipe/store";

export const GroceryAccordion = ({ title, Icon, color }: GrocerySection) => {
  const setItems = useGroceryStore((state) => state.setItems);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const groceryItems = useGroceryStore((state) => state.items);
  const setCurrentCategory = useGroceryStore(
    (state) => state.setSelectedCategory
  );
  const isMobile = useGeneralStore((state) => state.isMobile);
  const setCurrentForm = useGroceryStore((state) => state.setCurrentForm);
  const openAccordion = useGroceryStore((state) => state.currentSections);
  const setOpenAccordion = useGroceryStore((state) => state.setCurrentSections);

  const accordionItems = getGroceryAccordingItems(title, groceryItems);
  const setIsAddItem = useRecipeStore((state) => state.setIsAddItem);

  const handleAccordionAdd = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentCategory(title);
    setIsAddItem(true);
    setCurrentForm("addItem", setSplitLayout, isMobile);
  };

  const handleCheckboxChange = (
    section: GrocerySectionOptions,
    name: string,
    checked: boolean
  ) => {
    const updatedItems = groceryItems.map((item) => {
      if (
        item.category === section &&
        item.name.toLowerCase() === name.toLowerCase()
      ) {
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
      onValueChange={(newValue) =>
        setOpenAccordion(newValue as GrocerySectionOptions[])
      }
    >
      <AccordionItem
        value={title}
        className="w-[90%] md:w-[80%] max-w-[560px] mx-auto"
      >
        <AccordionTrigger
          className="flex items-center md:space-x-2 hover:no-underline hover:scale-105"
          data-testid={`${title}-accordion`}
        >
          <AccordionHeader title={title} Icon={Icon} color={color} />
          <div
            style={{
              color: "white",
              backgroundColor: color,
              borderRadius: "50%",
            }}
            onClick={(event) => handleAccordionAdd(event)}
            className="transition-all hover:scale-125"
            data-testid={`${title}-add-item-button`}
          >
            <Icons.plus />
          </div>
        </AccordionTrigger>

        <AccordionContent className="max-h-80 overflow-y-auto">
          <div className="mt-4 flex flex-col gap-x-4">
            {accordionItems.length === 0 ? (
              <p className="text-lg text-gray-400">
                No items currently in the {title} section.
              </p>
            ) : (
              accordionItems
                .filter((item) => item.category === title)
                .map((item) => (
                  <div
                    key={item.name.toLowerCase()}
                    className="flex mb-2 gap-x-4 items-center"
                  >
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={(checked: boolean) =>
                        handleCheckboxChange(
                          title,
                          item.name.toLowerCase(),
                          checked
                        )
                      }
                      data-testid={`${item.name}-checkbox`}
                    />
                    <p className="text-lg">
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </p>
                    <p className="bg-background text-foreground text-xs rounded-md p-1">
                      {item.quantity} {item.unit}
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
