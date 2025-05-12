"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import GroceryAccordion from "@/components/page-specific/grocery/GroceryListAccordion";
import { useGeneralStore } from "@/stores/general/store";
import { getCurrentGrocerySections } from "@/lib/items/utils";
import { JSX } from "react";

export default function List({
  className,
}: {
  className?: string;
}): JSX.Element {
  const splitLayout = useGeneralStore((state) => state.splitLayout);
  const isMobile = useGeneralStore((state) => state.isMobile);

  const currentCategories = getCurrentGrocerySections();

  let column1, column2, column3;

  if (splitLayout == false) {
    column1 = currentCategories.filter((_, index) => index % 3 === 0);
    column2 = currentCategories.filter((_, index) => index % 3 === 1);
    column3 = currentCategories.filter((_, index) => index % 3 === 2);
  } else if (isMobile == true) {
    column1 = currentCategories;
    column2 = undefined;
    column3 = undefined;
  } else {
    column1 = currentCategories.filter((_, index) => index % 2 === 0);
    column2 = currentCategories.filter((_, index) => index % 2 === 1);
    column3 = undefined;
  }
  return (
    <div className={cn(className)}>
      <ScrollArea className="w-full h-full">
        <div
          className={`flex flex-wrap gap-4 h-full bg-background ${
            isMobile ? "justify-center" : ""
          }`}
        >
          <div className="flex flex-col gap-4 w-[100%] md:min-w-[510px] md:max-w-[545px]">
            {column1.map((item) => (
              <GroceryAccordion key={item.title} {...item} />
            ))}
          </div>
          {column2 && (
            <div className="flex flex-col gap-4 w-[100%] md:min-w-[510px] md:max-w-[545px]">
              {column2.map((item) => (
                <GroceryAccordion key={item.title} {...item} />
              ))}
            </div>
          )}
          {column3 && (
            <div className="flex flex-col gap-4 w-[100%] md:min-w-[510px] md:max-w-[545px]">
              {column3.map((item) => (
                <GroceryAccordion key={item.title} {...item} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
