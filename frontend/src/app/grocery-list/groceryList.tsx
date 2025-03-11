"use client";

import { useEffect } from "react";

// Local Imports
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { useGroceryStore } from "@/stores/grocery/store";
import { useGeneralStore } from "@/stores/general/store";
import { List } from "@/components/common/grocery/list";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { showToast } from "@/providers/react-query-provider";
import type { GroceryList, NewGroceryList } from "@/types/grocery";
import { useAllGroceryLists } from "@/server/hooks/groceryListHooks";
import { useFetchGroceryListById } from "@/server/hooks/groceryListHooks";

interface GroceryListProps {
  renderContent: boolean;
  className?: string;
}
export default function GroceryList({
  renderContent,
  className,
}: GroceryListProps) {
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const splitLayout = useGeneralStore((state) => state.splitLayout);
  const isMobile = useGeneralStore((state) => state.isMobile);

  const setCurrentForm = useGroceryStore((state) => state.setCurrentForm);
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const currentList = useGroceryStore((state) => state.currentList);

  // use tanstack to fetch all grocery lists in metadata mode
  // this will only fetch the metadata of the grocery lists
  const {
    groceryLists,
    isErrorGroceryLists,
    isLoadingGroceryLists,
    errorGroceryLists,
  } = useAllGroceryLists({
    metadata: true,
    enabled: true,
  });

  const { refetchGroceryList, groceryList } = useFetchGroceryListById({
    id: currentList?._id || "",
    enabled: true,
  });

  // onsuccess and onerror handlers for the grocery lists query
  // do not exist anymore in tanstack
  useEffect(() => {
    if (isErrorGroceryLists) {
      showToast(
        TOAST_SEVERITY.ERROR,
        "Error",
        errorGroceryLists?.message || "Error Fetching Grocery Lists",
        3000
      );
    }

    if (isLoadingGroceryLists) {
      showToast(TOAST_SEVERITY.INFO, "Loading", "Fetching Grocery Lists", 3000);
    }

    // Only update current list if it's different
    if (groceryLists?.length > 0) {
      if (!currentList || currentList._id !== groceryLists[0]._id) {
        console.log("Setting Current List 69");
        setCurrentList(groceryLists[0]);
      }
    } else if (groceryLists?.length === 0 && !currentList) {
      const newList: NewGroceryList = {
        _id: null,
        creatorId: null,
        title: "New List",
        items: [],
      };
      setCurrentList(newList);
    }
  }, [groceryLists]);

  // refetch the grocery list when the current list changes
  useEffect(() => {
    async function fetchGroceryList() {
      if (currentList?._id) {
        console.log("Refetching Grocery List");
        // refetch the grocery list
        // must await the refetchGroceryList function
        await refetchGroceryList();
      }
    }
    fetchGroceryList();
  }, [currentList]);

  useEffect(() => {
    if (
      groceryList &&
      (groceryList._id === currentList?._id ||
        groceryList.items?.length !== currentList?.items?.length)
    ) {
      console.log("Setting Current List 102");
      console.log("Grocery List 102", groceryList);
      setCurrentList(groceryList);
    }
  }, [groceryList]);

  return (
    <>
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
