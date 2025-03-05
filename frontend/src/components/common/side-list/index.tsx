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
import { useGroceryStore } from "@/stores/grocery/store";
import { AddItem } from "../grocery/add-item";

export const SideList = () => {
  const currentForm = useGroceryStore((state) => state.currentForm);

  return (
    <div className="w-full h-full pl-0 md:pl-4 lg:pl-6 xl:pl-6">
      <Card className="h-full flex flex-col bg-card-background rounded-lg">
        <CardHeader className="bg-primary text-[#202020] text-center rounded-lg">
          <CardTitle className="text-2xl">Your List</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 bg-background overflow-y-auto">
          <ScrollArea>
            {currentForm === "addItem" ? (
              <AddItem />
            ) : (
              <List className="mt-4 bg-card-background" />
            )}
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-end p-4">
          <AddButton />
        </CardFooter>
      </Card>
    </div>
  );
};
