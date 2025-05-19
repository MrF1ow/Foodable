import React, { JSX } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SaveItemAccordionProps {
  title: string;
  content: React.ReactNode;
  iconSize: number;
  textSize: string;
  additional?: React.ReactNode;
}

export default function SaveItemAccordion({
  title,
  content,
  iconSize,
  textSize,
  additional,
}: SaveItemAccordionProps): JSX.Element {
  return (
    <Accordion
      type="single"
      className="bg-card-background rounded-lg shadow-md overflow-hidden max-w-full min-w-full"
      collapsible
      data-testid={`saved-category-${title}`}
    >
      <AccordionItem value="1" className="p-4">
        <AccordionTrigger
          className="text-foreground font-bold"
          iconSize={iconSize}
          style={
            {
              fontSize: textSize,
            } as React.CSSProperties
          }
        >
          <div className="flex flex-row items-center justify-start ">
            {title}
            {additional}
          </div>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col overflow-hidden">
          {/* Line at the top, centered */}
          <div className="w-3/4 h-[2px] bg-primary mx-auto my-4" />

          {content}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
