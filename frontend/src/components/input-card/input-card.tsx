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
import { InputSection } from "@/types/input";

export const InputCard = ({ title }: InputSection) => {
  return (
    <Card>
      <InputHeader title={title} />
      <CardContent>Content</CardContent>
      <InputFooter>Footer</InputFooter>
    </Card>
  );
};
