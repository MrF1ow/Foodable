import { useEffect, useRef } from "react";
import {
  useFetchAllGroceryLists,
  useDeleteGroceryList,
} from "@/server/hooks/groceryListHooks";
import { useGroceryStore } from "@/stores/grocery/store";
import { GroceryList } from "@/types/grocery";
import { Toast } from "primereact/toast";
import { list } from "postcss";

export const GroceryListsFetcher = () => {
  const toast = useRef<Toast>(null);

  const {
    groceryLists: fetchedGroceryLists,
    isLoadingGroceryLists,
    errorGroceryLists,
  } = useFetchAllGroceryLists({ enabled: true });

  const setCurrentLists = useGroceryStore((state) => state.setCurrentLists);
  const currentLists = useGroceryStore((state) => state.currentLists);

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
    // If there are no grocery lists, do nothing
    if (!fetchedGroceryLists || fetchedGroceryLists.length === 0) return;

    // If the lists are different, update the current lists
    const isDifferent =
      currentLists.length !== fetchedGroceryLists.length ||
      fetchedGroceryLists.some(
        (list: GroceryList, index: number) =>
          list._id !== currentLists[index]?._id ||
          list.title !== currentLists[index]?.title
      );

    if (isDifferent) {
      setCurrentLists(fetchedGroceryLists);
    }
  }, [fetchedGroceryLists, setCurrentLists]);

  return <Toast ref={toast} position="bottom-center" />;
};
