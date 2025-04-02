"use client";

import { useEffect } from "react";

// Local Imports
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { useGroceryStore } from "@/stores/grocery/store";
import { useGeneralStore } from "@/stores/general/store";
import { List } from "@/components/common/grocery/list";
import type { GroceryList } from "@/types/grocery";
import GroceryListDataFetcher from "@/components/common/grocery/grocery-list-data-fetcher";
import SavedDataFetcher from "@/components/common/saved/saved-data-fetcher";

interface GroceryListProps {
  isUser?: boolean;
  renderContent: boolean;
  className?: string;
}
export default function GroceryList({
  isUser,
  renderContent,
  className,
}: GroceryListProps) {
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const splitLayout = useGeneralStore((state) => state.splitLayout);
  const isMobile = useGeneralStore((state) => state.isMobile);
  const currentList = useGroceryStore((state) => state.currentList);
  const setCurrentForm = useGroceryStore((state) => state.setCurrentForm);

  return (
    <>
      {isUser && <GroceryListDataFetcher />}
      <SavedDataFetcher />
      {currentList && <List className={className} />}
      {renderContent && !splitLayout && (
        <Button
          className={`btn-primary rounded-full w-12 h-12 hover:bg-primary flex items-center justify-center fixed bottom-4 right-4 z-50 ${
            isMobile ? "mb-16" : ""
          }`}
          data-testid="helper-button"
          onClick={() =>
            setCurrentForm("groceryHelper", isMobile, setSplitLayout)
          }
        >
          <Icons.ai className="!w-6 !h-6" />
        </Button>
      )}
    </>
  );
}
