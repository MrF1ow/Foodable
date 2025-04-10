"use client";

import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

// Local Imports
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GroceryHeader } from "../grocery/grocery-header";
import { GroceryHeaderMin } from "../grocery/grocery-header-min";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGroceryStore } from "@/stores/grocery/store";
import GroceryList from "@/app/(data-hydrate)/grocery-list/groceryList";
import { useRecipeStore } from "@/stores/recipe/store";
import { AddItem } from "../grocery/add-item";
import { AddRecipe } from "../recipe/add-recipe";

interface SideListProps {
  isUser: boolean;
  additionalBackButtonClick?: () => void;
}

export const SideList = ({ isUser, additionalBackButtonClick }: SideListProps) => {
  const currentForm = useGroceryStore((state) => state.currentForm);
  const createForm = useRecipeStore((state) => state.createForm);

  const pathname = usePathname();
  const [savedPage, setSavedPage] = useState(false);

  useEffect(() => {
    if (pathname.includes("saved")) {
      setSavedPage(true);
    } else {
      setSavedPage(false);
    }
  }, [pathname]);

  const handleBackButtonClick = () => {
    additionalBackButtonClick?.();
  }

  if (createForm) {
    return <AddRecipe />;
  } else {
    return (
      <>
        <div className="w-full h-full pl-0 md:pl-4 lg:pl-6 xl:pl-6">
          <Card className="h-full flex flex-col bg-card-background rounded-lg">
            <CardHeader className="bg-primary text-[#202020] text-center rounded-lg">
              {savedPage ? (
                <GroceryHeaderMin width="100%" />
              ) : (
                <GroceryHeader width="100%" />
              )}
            </CardHeader>
            <CardContent className="flex-1 bg-background overflow-y-auto">
              <ScrollArea>
                {currentForm === "addItem" ? (
                  <AddItem />
                ) : (
                  <GroceryList
                    isUser={isUser}
                    renderContent={false}
                    className="mt-4 bg-card-background"
                  />
                )}
              </ScrollArea>
              {additionalBackButtonClick && (
                <div className="absolute top-0 right-0 text-foreground p-4 z-50">
                  <MdClose onClick={handleBackButtonClick} size={40} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </>
    );
  }
};
