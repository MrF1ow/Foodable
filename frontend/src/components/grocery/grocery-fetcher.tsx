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

  const setCurrentLists = useGroceryStore((state) => state.setCurrentLists);
  const currentLists = useGroceryStore((state) => state.currentLists);
  const setCurrentGroceryList = useGroceryStore(
    (state) => state.setCurrentGroceryListId
  );
  const fetchAndStore = useGroceryStore((state) => state.fetchFullGroceryList);

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
    const fetchData = async () => {
      if (fetchedGroceryLists && fetchedGroceryLists.length > 0) {
        const isDifferent =
          currentLists.length !==
          fetchedGroceryLists.some(
            (list: GroceryList, index: number) =>
              list._id !== currentLists[index]?._id
          );

        if (isDifferent) {
          setCurrentLists(fetchedGroceryLists);

          if (!currentLists.length) {
            setCurrentLists(fetchedGroceryLists);
          }

          setCurrentLists(currentLists);
          // set the first list as the current list
          setCurrentGroceryList(currentLists[0]._id.toString());
          await fetchAndStore(currentLists[0]._id.toString());
        }
      }
    };

    fetchData();
  }, [fetchedGroceryLists, currentLists, setCurrentLists]);

  return <Toast ref={toast} position="bottom-center" />;
};
