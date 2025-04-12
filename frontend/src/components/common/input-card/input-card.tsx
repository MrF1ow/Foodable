import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { InputHeader } from "./input-header";
import { InputFooter } from "./input-footer";
import {
  InputHeaderProp,
  InputContentProp,
  InputFooterProp,
} from "@/types/input";
import { useGeneralStore } from "@/stores/general/store";

interface InputSectionProps
  extends InputHeaderProp,
    InputContentProp,
    InputFooterProp {}

export const InputCard = ({
  title,
  onClick,
  content,
  footer,
}: InputSectionProps) => {
  const isMobile = useGeneralStore((state) => state.isMobile);
  return (
    <Card
      className={`${
        isMobile ? "items-center h-[91%]" : "h-full"
      } w-full flex flex-col bg-card-background`}
    >
      <InputHeader title={title} onClick={onClick} />
      <CardContent className="flex-grow overflow-y-auto">{content}</CardContent>
      <InputFooter>{footer}</InputFooter>
    </Card>
  );
};
