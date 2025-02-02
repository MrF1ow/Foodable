"use client";
import { List } from "../grocery/list";

// Local Imports
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddButton } from "./add-button";
import { AddItem } from "../grocery/add-item";
import { useRecipeStore } from "@/stores/recipe/store";

export const SideList = () => {
  const isAddItem = useRecipeStore((state) => state.isAddItem);
  return (
    <Card className="h-full flex flex-col bg-card-background rounded-lg">
      <CardHeader className="bg-primary text-[#202020] text-center rounded-lg">
        <CardTitle className="text-2xl">Your List</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 bg-background overflow-y-auto">
        <ScrollArea>
          {isAddItem ? (
            <AddItem className="mt-4" />
          ) : (
            <List className="mt-4 bg-card-background" />
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-end p-4">
        <AddButton />
      </CardFooter>
    </Card>
  );
};
