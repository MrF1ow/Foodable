"use client";

import { useEffect, useState } from "react";

// Local Imports
import { useGroceryStore } from "@/stores/grocery/store";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { showToast } from "@/app/providers";
import type { NewGroceryList } from "@/types/grocery";
import { useAllGroceryLists } from "@/server/hooks/groceryListHooks";
import { useFetchGroceryListById } from "@/server/hooks/groceryListHooks";
import { useFetchUserCurrentList } from "@/server/hooks/userHooks";
import { isValidObjectId } from "@/lib/validation/types/general";
import { getAvailableGroceryLists } from "@/lib/items/utils";
import { useUserStore } from "@/stores/user/store";

export default function GroceryListDataFetcher() {
  const isUser = useUserStore((state) => state.isUser);
  if (!isUser) {
    return null;
  }

  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const setAvailableLists = useGroceryStore((state) => state.setAvailableLists);
  const currentList = useGroceryStore((state) => state.currentList);
  const isSharedView = useGroceryStore((state) => state.isSharedView);

  // fetch the currentList that the user is currently on
  // this will be used to fetch the grocery list by id
  const {
    currentGroceryListId,
    isLoadingCurrentListId,
    refetchCurrentListId,
    isErrorCurrentListId,
  } = useFetchUserCurrentList({
    enabled: true,
  });

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

  // fetch the grocery list by id that is stored in the currentList state of the user data
  const { refetchGroceryList } = useFetchGroceryListById({
    id: currentGroceryListId,
    enabled:
      !!currentGroceryListId &&
      isValidObjectId(currentGroceryListId) &&
      currentGroceryListId !== currentList?._id,
  });

  async function refetchUserCurrentListId(): Promise<{ data?: string | null }> {
    return await refetchCurrentListId();
  }

  // handle the grocery lists metadata and set the available lists
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

    const availableLists = getAvailableGroceryLists(groceryLists);
    console.log("Available Lists", availableLists);
    setAvailableLists(availableLists);
  }, [currentList]);

  // handle the current grocery list and set the current list
  useEffect(() => {
    if (isLoadingCurrentListId) {
      showToast(
        TOAST_SEVERITY.INFO,
        "Loading",
        "Fetching Current Grocery List",
        3000
      );
    }

    if (isErrorCurrentListId) {
      showToast(
        TOAST_SEVERITY.ERROR,
        "Error",
        "Error Fetching Current Grocery List",
        3000
      );
    }
    // if the current grocery list is not null, refetch the grocery list
    // if the current grocery list is null, create a new grocery list
    if (currentGroceryListId && isValidObjectId(currentGroceryListId)) {
      // if the grocery list is not null, set the current list to the grocery list
      refetchGroceryList().then((result) => {
        if (result?.data) {
          if (isSharedView) {
            console.log("Shared view, not creating new list");
            return;
          }
          setCurrentList(result.data);
        }
      });
    } else if (currentGroceryListId && !isValidObjectId(currentGroceryListId)) {
      showToast(TOAST_SEVERITY.ERROR, "Error", "Invalid Grocery List ID", 3000);
      const newList: NewGroceryList = {
        _id: null,
        creatorId: null,
        title: "New List",
        items: [],
      };
      setCurrentList(newList);
    } else {
      if (isSharedView) {
        console.log("Shared view, not creating new list");
        return;
      }
      const newList: NewGroceryList = {
        _id: null,
        creatorId: null,
        title: "New List",
        items: [],
      };
      setCurrentList(newList);
    }
  }, [currentGroceryListId]);

  // refetch the grocery list when the current list changes
  useEffect(() => {
    if (currentList?._id) {
      if (isValidObjectId(currentList._id)) {
        refetchUserCurrentListId();
      }
    }
  }, [currentList]);

  return <></>;
}
