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

export const GroceryAccordion = ({ title, Icon, color }: GrocerySection) => {
  const groceryItems = [
    { title: "Croissant", quantity: "2" },
    { title: "Croissant", quantity: "2" },
    { title: "Croissant", quantity: "2" },
    { title: "Croissant", quantity: "2" },
    { title: "Croissant", quantity: "2" },
    { title: "Croissant", quantity: "2" },
    { title: "Croissant", quantity: "2" },
    { title: "Croissant", quantity: "2" },
    { title: "Croissant", quantity: "2" },
    { title: "Croissant", quantity: "2" },
  ];

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
      className="w-[400px] bg-card-background rounded-lg shadow-lg"
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
                <p className="text-lg">{item.title}</p>
                <p className="bg-gray-100 text-xs rounded-md p-1">
                  {item.quantity} pcs
                </p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
