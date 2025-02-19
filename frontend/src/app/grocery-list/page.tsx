"use client";

// Local Imports
import { MainLayout } from "@/layouts/main";
import { ContentLayout } from "@/layouts/content";
import { AddItem } from "@/components/grocery/add-item";
import { FindPrice as FindPrice } from "@/components/grocery/find-price";
import { HelperCard } from "@/components/grocery/list-helper";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { useGroceryStore } from "@/stores/grocery/store";
import { useGeneralStore } from "@/stores/general/store";
import { List } from "@/components/grocery/list";
import { GroceryHeaderWithChildren } from "@/components/grocery/grocery-header-with-children";
import { GroceryListsFetcher } from "@/components/grocery/grocery-fetcher";
import { useUpdateGroceryList } from "@/server/hooks/groceryListHooks";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { showToast } from "@/providers/react-query-provider";
import { useEffect, useState } from "react";
import type { NewGroceryList, GroceryList } from "@/types/grocery";

export default function GroceryList() {
  const splitLayout = useGeneralStore((state) => state.splitLayout);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const currentCard = useGroceryStore((state) => state.currentForm);
  const setCurrentForm = useGroceryStore((state) => state.setCurrentForm);
  const setItems = useGroceryStore((state) => state.setItems);
  const isMobile = useGeneralStore((state) => state.isMobile);
  const currentList = useGroceryStore((state) => state.currentList.data);

  const getCurrentData = useGroceryStore((state) => state.getCurrentData);
  const [groceryList, setGroceryList] = useState<
    null | GroceryList | NewGroceryList
  >(getCurrentData());

  useEffect(() => {
    console.log("GroceryList useEffect");
    console.log("Current List", currentList);
    console.log("Grocery List", groceryList);
  }, []);

  const { updateGroceryList } = useUpdateGroceryList();

  const handleItemDeletion = () => {
    const groceryList = getCurrentData();
    console.log("Grocery List", groceryList);
    const groceryItems = groceryList?.items;
    console.log("Grocery Items", groceryItems);
    if (!groceryItems) return;

    const uncheckedItems = groceryItems.filter((item) => !item.checked);
    console.log("Unchecked Items", uncheckedItems);
    groceryList!.items = uncheckedItems;
    console.log("Updated Grocery List", groceryList);
    setItems(uncheckedItems);

    // only make the API call if the list is saved and has an id in the database
    if ("_id" in groceryList && groceryList._id) {
      console.log("Updating Grocery List");
      updateGroceryList(groceryList);
    }
    showToast(
      TOAST_SEVERITY.SUCCESS,
      "Deleted",
      `Checked Items have been Removed`,
      3000
    );
  };

  const Content = () => {
    return (
      <>
        <GroceryListsFetcher />

        {groceryList && <List groceryList={groceryList} />}
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
  };

  const renderRightSideCard = () => {
    switch (currentCard) {
      case "addItem":
        return <AddItem className="h-full" />;
      case "findPrice":
        return <FindPrice />;
      case "groceryHelper":
        return <HelperCard />;
      default:
        return null;
    }
  };

  const MainPage = () => {
    return (
      <MainLayout
        headerComponent={
          <GroceryHeaderWithChildren
            width="25%"
            children={
              <div className="flex items-center justify-center">
                <Button
                  onClick={handleItemDeletion}
                  className="mx-6 p-6 bg-destructive rounded-md hover:scale-105 hover:shadow-lg transition-all"
                  data-testid="remove-items-button"
                >
                  <Icons.delete className="!h-6 !w-6" />
                </Button>
                <Button
                  onClick={() =>
                    setCurrentForm("findPrice", isMobile, setSplitLayout)
                  }
                  className="text-2xl p-6 bg-primary font-bold rounded-md hover:scale-105 hover:shadow-lg transition-all"
                  data-testid="find-price-button"
                >
                  {"Find Price"}
                </Button>
              </div>
            }
          />
        }
      >
        <ContentLayout
          split={splitLayout}
          mainContent={<Content />}
          subContent={renderRightSideCard()}
        />
      </MainLayout>
    );
  };

  return isMobile ? (
    currentCard !== "" ? (
      <MainLayout children={renderRightSideCard()} />
    ) : (
      <MainPage />
    )
  ) : (
    <MainPage />
  );
}
