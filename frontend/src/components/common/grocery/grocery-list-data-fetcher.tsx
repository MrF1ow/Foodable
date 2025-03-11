"use client";

import { useEffect } from "react";

// Local Imports
import { useGroceryStore } from "@/stores/grocery/store";
import { useGeneralStore } from "@/stores/general/store";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { showToast } from "@/providers/react-query-provider";
import type { NewGroceryList } from "@/types/grocery";
import { useAllGroceryLists } from "@/server/hooks/groceryListHooks";
import { useFetchGroceryListById } from "@/server/hooks/groceryListHooks";
import { useFetchUserLocation } from "@/server/hooks/googleHooks";
import { useUserStore } from "@/stores/user/store";
import { getBrowserLocation } from "@/utils/getBrowserLocation";

export default function GroceryListDataFetcher() {
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const splitLayout = useGeneralStore((state) => state.splitLayout);
  const isMobile = useGeneralStore((state) => state.isMobile);

  const setCurrentForm = useGroceryStore((state) => state.setCurrentForm);
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const currentList = useGroceryStore((state) => state.currentList);
  const { userLocation, refetchUserLocation } = useFetchUserLocation();
  const setLocation = useUserStore((state) => state.setLocation);

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
    async function fetchUserLocation() {
      const browserLocation = await getBrowserLocation();
      if (browserLocation) {
        setLocation(browserLocation);
        console.log("User Location From Browser:", browserLocation);
      } else {
        const result = await refetchUserLocation();
        const location = result.data;
        if (location) {
          setLocation(location);
          console.log("User Location From Google:", location);
        }
      }
    }
    fetchUserLocation();

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
  return <></>;
}
