import { useEffect, useRef } from "react";
import {
  useFetchAllGroceryLists,
  useDeleteGroceryList,
} from "@/server/hooks/groceryListHooks";
import { useGroceryStore } from "@/stores/grocery/store";
import { GroceryList } from "@/types/grocery";
import { Toast } from "primereact/toast";

export const GroceryListsFetcher = () => {
  const toast = useRef<Toast>(null);

  const {
    groceryLists: fetchedGroceryLists,
    isLoadingGroceryLists,
    errorGroceryLists,
  } = useFetchAllGroceryLists({ enabled: true });

  const setCurrentGroceryLists = useGroceryStore(
    (state) => state.setCurrentGroceryLists
  );
  const currentGroceryLists = useGroceryStore((state) => state.groceryLists);
  const setCurrentLists = useGroceryStore((state) => state.setCurrentLists);
  const currentLists = useGroceryStore((state) => state.currentLists);
  const listDeleted = useGroceryStore((state) => state.listDeleted);
  const setItems = useGroceryStore((state) => state.setItems);

  useEffect(() => {
    if (isLoadingGroceryLists && toast.current) {
      toast.current.show({
        severity: "info",
        summary: "Loading",
        detail: "Fetching grocery lists...",
        sticky: true,
      });
    }
  }, [isLoadingGroceryLists]);

  useEffect(() => {
    if (!listDeleted) {
      if (fetchedGroceryLists && fetchedGroceryLists.length > 0) {
        console.log("Current Lists from fetcher", currentLists);
        console.log("Lists fetched from db", fetchedGroceryLists);
        const isDifferent =
          currentGroceryLists.length !== fetchedGroceryLists.length ||
          fetchedGroceryLists.some(
            (list: GroceryList, index: number) =>
              list._id !== currentGroceryLists[index]?._id
          );
        if (isDifferent) {
          setCurrentGroceryLists(fetchedGroceryLists);

          const newLists = fetchedGroceryLists.map((list) => ({
            title: list.title,
            _id: list._id,
            category: "",
          }));

          setCurrentLists(newLists);
          //   currentLists.forEach((currentList) => {
          //     const matchedList = fetchedGroceryLists.find(
          //       (fetchedList) => fetchedList._id === currentList._id
          //     );
          //     if (matchedList) {
          //       console.log(
          //         "Items being set:",
          //         matchedList.title,
          //         matchedList.items
          //       );
          //       setItems(matchedList.items);
          //     }
          //   });
        }
      }
    }
  }, [fetchedGroceryLists]);

  return <Toast ref={toast} position="bottom-center" />;
};
