import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface GeneralAccordionProps {
  title: string;
  content: React.ReactNode;
  width: string;
  iconSize: number;
  textSize: string;
}

export const GeneralAccordion = ({
  title,
  content,
  width,
  iconSize,
  textSize,
}: GeneralAccordionProps) => {
  return (
    <Accordion
      type="single"
      className="bg-card-background rounded-lg shadow-md"
      collapsible
      style={{ width: width }}
    >
      <AccordionItem value="1" className="p-4">
        <AccordionTrigger
          className="w-full text-foreground font-bold"
          iconSize={iconSize}
          style={
            {
              fontSize: textSize,
            } as React.CSSProperties
          }
        >
          {title}
        </AccordionTrigger>
        <AccordionContent className="flex flex-col w-full overflow-hidden">
          {/* Line at the top, centered */}
          <div className="w-3/4 h-[2px] bg-primary mx-auto my-4"></div>
          <div className="flex flex-row gap-4 w-full overflow-y-auto">
            {content}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
