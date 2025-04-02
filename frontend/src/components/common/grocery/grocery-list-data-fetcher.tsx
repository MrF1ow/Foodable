"use client";

import { useEffect } from "react";

// Local Imports
import { useGroceryStore } from "@/stores/grocery/store";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { showToast } from "@/providers/react-query-provider";
import type { NewGroceryList } from "@/types/grocery";
import { useAllGroceryLists } from "@/server/hooks/groceryListHooks";
import { useFetchGroceryListById } from "@/server/hooks/groceryListHooks";
import { useFetchUserCurrentList } from "@/server/hooks/userHooks";
import { useFetchUserLocation } from "@/server/hooks/googleHooks";
import { useUserStore } from "@/stores/user/store";
import { getBrowserLocation } from "@/utils/getBrowserLocation";
import { isValidObjectId } from "@/utils/typeValidation/general";
import { getAvailableGroceryLists } from "@/utils/listItems";
import { isValid } from "zod";

export default function GroceryListDataFetcher() {
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const setAvailableLists = useGroceryStore((state) => state.setAvailableLists);
  const currentList = useGroceryStore((state) => state.currentList);
  const { refetchUserLocation } = useFetchUserLocation();
  const setLocation = useUserStore((state) => state.setLocation);

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
  const { refetchGroceryList, groceryList } = useFetchGroceryListById({
    id: currentGroceryListId.toString(),
    enabled: true,
  });

  async function refetchCurrentGroceryListId() {
    if (currentGroceryListId && isValidObjectId(currentGroceryListId)) {
      await refetchCurrentListId();
    }
  }

  async function refetchGroceryLists() {
    await refetchGroceryList();
  }

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
  }, []);

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
      refetchCurrentGroceryListId();
      console.log("CurrentList", groceryList);

      // if the grocery list is not null, set the current list to the grocery list
      setCurrentList(groceryList);
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
      if (
        isValidObjectId(currentList._id) &&
        currentList._id.toString() !== currentList.toString()
      ) {
        refetchCurrentListId();
        refetchGroceryLists();
        console.log("Refetching Grocery List", currentList._id);
      }
    }
  }, [currentList]);

  return <></>;
}
