"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { JSX, useEffect, useState } from "react";
import {
  GrocerySection,
  GrocerySectionOptions,
  GroceryList,
  GroceryItem,
} from "@/types/grocery";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "../../ui/icons";
import { useGroceryStore } from "@/stores/grocery/store";
import { useGeneralStore } from "@/stores/general/store";
import { getGroceryAccordingItems } from "@/lib/items/utils";
import { useUpdateGroceryList } from "@/server/hooks/groceryListHooks";
import { FORM_NAMES } from "@/lib/constants/forms";
import { useUserStore } from "@/stores/user/store";
import { Input } from "@/components/ui/input";

const AccordionHeader = ({ title, Icon, color }: GrocerySection) => {
  return (
    <div className="flex items-center w-full space-x-2 transition-all hover:scale-y-105">
      <Icon className="w-10 h-10" fill={color} />
      <p className="text-xl font-bold" style={{ color: color }}>
        {title}
      </p>
    </div>
  );
};

export default function GroceryAccordion({
  title,
  Icon,
  color,
}: GrocerySection): JSX.Element {
  const isUser = useUserStore((state) => state.isUser);
  const { updateGroceryList } = useUpdateGroceryList();

  const setCurrentCategory = useGroceryStore(
    (state) => state.setSelectedCategory
  );
  const openAccordion = useGroceryStore((state) => state.openSections);
  const currentList = useGroceryStore((state) => state.currentList);

  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const setCurrentForm = useGeneralStore((state) => state.setCurrentSidePortalForm);
  const showMainPortal = useGeneralStore((state) => state.showMainPortal);
  const setShowPortal = useGeneralStore((state) => state.setShowPortal);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const setOpenAccordion = useGroceryStore((state) => state.setOpenSections);

  const [accordionItems, setAccordionItems] = useState<
    GroceryItem[] | undefined
  >([]);

  useEffect(() => {
    if (!currentList) return;

    const items = getGroceryAccordingItems(
      title,
      currentList.items as GroceryItem[]
    );
    setAccordionItems(items);
  }, [currentList]);

  const handleAccordionAdd = (event: React.MouseEvent) => {
    event.stopPropagation();
    setCurrentCategory(title);
    setCurrentForm(FORM_NAMES.ADD_ITEM_TO_LIST);
    if (!showMainPortal) {
      setShowPortal(true);
      setSplitLayout(true);
    }
  };

  const handleCheckboxChange = async (
    section: GrocerySectionOptions,
    name: string,
    checked: boolean
  ) => {
    const updatedItems = currentList?.items.map((item) => {
      if (
        item.category === section &&
        item.name.toLowerCase() === name.toLowerCase()
      ) {
        return { ...item, checked };
      }
      return item;
    });

    if (!currentList) return;

    const newList = { ...currentList, items: updatedItems };

    setCurrentList(newList as GroceryList);

    if (currentList._id && isUser) {
      await updateGroceryList(newList as GroceryList);
    }

  };

  let quantityUpdateTimeout: any;

  const handleQuantityChange = async (
    section: GrocerySectionOptions,
    name: string,
    newQuantity: number
  ) => {
    const updatedItems = currentList?.items.map((item) => {
      if (
        item.category === section &&
        item.name.toLowerCase() === name.toLowerCase()
      ) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    if (!currentList) return;

    const newList = { ...currentList, items: updatedItems };

    setCurrentList(newList as GroceryList);

    clearTimeout(quantityUpdateTimeout);
    quantityUpdateTimeout = setTimeout(async () => {
      if (currentList._id && isUser) {
        await updateGroceryList(newList as GroceryList);
      }
    }, 500);
  };

  return (
    <Accordion
      type="multiple"
      className="flex flex-row bg-card-background rounded-lg shadow-lg justify-between p-4"
      value={openAccordion}
      onValueChange={(newValue) =>
        setOpenAccordion(newValue as GrocerySectionOptions[])
      }
    >
      <AccordionItem value={title} className="w-full">
        <AccordionTrigger
          className="flex items-center md:space-x-2 hover:no-underline"
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
            className="transition-all hover:scale-105 mr-2"
            data-testid={`${title}-add-item-button`}
          >
            <Icons.plus />
          </div>
        </AccordionTrigger>

        <AccordionContent className="max-h-80 overflow-y-auto">
          <div className="mt-4 flex flex-col gap-x-4">
            {accordionItems === undefined || accordionItems.length === 0 ? (
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
                    <div className="flex items-center gap-x-1">
                      <Input
                        type="number"
                        min={0}
                        value={item.quantity}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          handleQuantityChange(
                            title,
                            item.name.toLowerCase(),
                            value
                          );
                        }}
                        className="max-w-[3rem] h-7 text-center bg-background text-foreground text-xs p-1"
                      />
                      <span className="text-xs">{item.unit}</span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
