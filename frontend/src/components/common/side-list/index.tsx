"use client";
import { MdClose } from "react-icons/md";

// Local Imports
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GroceryHeader } from "../grocery/grocery-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGroceryStore } from "@/stores/grocery/store";
import GroceryList from "@/app/grocery-list/groceryList";
import { AddItem } from "../grocery/add-item";

interface SideListProps {
  toggleDialog?: () => void;
}

export const SideList = ({ toggleDialog }: SideListProps) => {
  const currentForm = useGroceryStore((state) => state.currentForm);

  return (
    <>
      <div className="w-full h-full pl-0 md:pl-4 lg:pl-6 xl:pl-6">
        <Card className="h-full flex flex-col bg-card-background rounded-lg">
          <CardHeader className="bg-primary text-[#202020] text-center rounded-lg">
            <GroceryHeader width="100%" />
          </CardHeader>
          <CardContent className="flex-1 bg-background overflow-y-auto">
            <ScrollArea>
              {currentForm === "addItem" ? (
                <AddItem />
              ) : (
                <GroceryList
                  renderContent={false}
                  className="mt-4 bg-card-background"
                />
              )}
            </ScrollArea>
            {toggleDialog && (
              <div className="absolute top-0 right-0 text-foreground p-4 z-50">
                <MdClose onClick={toggleDialog} size={40} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};
