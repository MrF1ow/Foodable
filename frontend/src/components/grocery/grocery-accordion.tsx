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
import { Icons } from "../ui/icons";

export const GroceryAccordion = ({
  title,
  Icon,
  color,
  handleAddItem,
}: GrocerySection & {
  handleAddItem?: () => void;
}) => {
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
      className="w-[564px] bg-card-background rounded-lg shadow-lg"
      collapsible
      defaultValue="1"
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
            onClick={handleAddItem}
          >
            <Icons.plus />
          </div>
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
                <p className="bg-background text-foreground text-xs rounded-md p-1">
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
