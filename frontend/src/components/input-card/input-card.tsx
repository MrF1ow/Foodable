import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { InputHeader } from "./input-header";
import { InputFooter } from "./input-footer";
import {
  InputHeaderProp,
  InputContentProp,
  InputFooterProp,
} from "@/types/input";

interface InputSectionProps
  extends InputHeaderProp,
    InputContentProp,
    InputFooterProp {}

export const InputCard = ({ title, content, footer }: InputSectionProps) => {
  return (
    <Card className="h-full w-full flex flex-col bg-card-background">
      <InputHeader title={title} />
      <CardContent className="flex-grow">{content}</CardContent>
      <InputFooter>{footer}</InputFooter>
    </Card>
  );
};
