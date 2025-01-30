import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GrocerySection } from "@/types/grocery";
import { AccordionHeader } from "./accordion-header";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useGroceryStore } from "@/stores/grocery/store";

export const GroceryAccordion = ({
  title,
  Icon,
  color,
}: GrocerySection) => {
  const groceryItems = useGroceryStore((state) => state.items);
  const setGroceryItems = useGroceryStore((state) => state.setItems);

  // have the title and each according go through and find their items to display

  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(groceryItems.length).fill(false)
  );

  const handleCheckboxChange = (index: number, checked: boolean) => {
    setCheckedItems((prev) => {
      const updated = [...prev];
      updated[index] = checked;
      return updated;
    });
  };

  return (
    <Accordion
      type="single"
      className="w-[300px] bg-card-background rounded-lg shadow-lg"
      collapsible
      defaultValue="1"
    >
      <AccordionItem value={title} className="w-[80%] mx-auto">
        <AccordionTrigger>
          <AccordionHeader title={title} Icon={Icon} color={color} />
        </AccordionTrigger>
        <AccordionContent>
          <div className="mt-4 flex flex-col gap-x-4">
            {groceryItems.map((item, index) => (
              <div key={index} className="flex mb-2 gap-x-4 items-center">
                <Checkbox
                  checked={checkedItems[index] ?? false}
                  onCheckedChange={(checked: boolean) =>
                    handleCheckboxChange(index, checked)
                  }
                />
                <p className="text-lg">{item.name}</p>
                <p className="bg-background text-foreground text-xs rounded-md p-1">
                  {item.quantity} {item.unit}
                </p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
