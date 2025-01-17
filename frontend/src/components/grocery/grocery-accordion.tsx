import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GrocerySection } from "@/types/grocery";
import { AccordionHeader } from "./accordion-header";
import { Checkbox } from "@/components/ui/checkbox";

export const GroceryAccordion = ({ title, Icon, color }: GrocerySection) => {
  return (
    <Accordion
      type="single"
      className="w-[400px] bg-card-background"
      collapsible
      defaultValue="1"
    >
      <AccordionItem value={title} className="w-[80%] mx-auto">
        <AccordionTrigger>
          <AccordionHeader title={title} Icon={Icon} color={color} />
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-4 rounded-md flex gap-x-4">
            <Checkbox />
            <p>Croissant</p>
            <p>2 pcs</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
