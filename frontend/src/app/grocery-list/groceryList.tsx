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
import type { GroceryItem, GroceryList, NewGroceryList } from "@/types/grocery";
import { useAllGroceryLists } from "@/server/hooks/groceryListHooks";
import { useFetchGroceryListById } from "@/server/hooks/groceryListHooks";

export default function GroceryList() {
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

    // if there are no grocery lists, create a new list
    if (groceryLists && groceryLists.length === 0) {
      const list = {
        _id: null, // make sure to set the _id to null (it does not exist yet on the server)
        creatorId: null, // make sure to set the creatorId to null
        title: "New List",
        items: [] as GroceryItem[],
      } as NewGroceryList;
      setCurrentList(list);
    } else if (groceryLists && groceryLists.length > 0) {
      // if there are grocery lists, set the first list as the current list
      // this is done to avoid the current list being null
      setCurrentList(groceryLists[0]);
    }
  }, [groceryLists, isErrorGroceryLists, isLoadingGroceryLists]);

  // refetch the grocery list when the current list changes
  useEffect(() => {
    if (currentList?._id) {
      refetchGroceryList();
      setCurrentList(groceryList);
    }
  }, [currentList, refetchGroceryList, setCurrentList, groceryList]);

  return (
    <>
      {currentList && <List />}
      {!splitLayout && (
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
