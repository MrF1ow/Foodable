"use client";

import { JSX, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { usePathname } from "next/navigation";

// Local Imports
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GroceryHeader, GroceryHeaderMin } from "@/components/page-specific/grocery/GroceryHeaders";
import { ScrollArea } from "@/components/ui/scroll-area";
import GroceryList from "@/app/(data-hydrate)/grocery-list/groceryList";

interface SideListProps {
  isUser: boolean;
  additionalBackButtonClick?: () => void;
}

export default function SideList ({ isUser, additionalBackButtonClick }: SideListProps): JSX.Element {
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
              <GroceryList
                isUser={isUser}
                renderContent={false}
                className="mt-4 bg-card-background"
              />
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
};
