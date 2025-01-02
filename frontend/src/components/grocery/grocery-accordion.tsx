import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GrocerySection } from "@/types/grocery";
import { AccordionHeader } from "./accordion-header";

export const GroceryAccordion = ({ title, Icon, color }: GrocerySection) => {
  return (
    <Accordion
      type="single"
      className="w-[200px] bg-card-background"
      collapsible
      defaultValue="1"
    >
      <AccordionItem value={title} className="w-[80%] mx-auto">
        <AccordionTrigger>
          <AccordionHeader title={title} Icon={Icon} color={color} />
        </AccordionTrigger>
        <AccordionContent>
          <div className="p-4 rounded-md">
            <p>Accordion Content</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
