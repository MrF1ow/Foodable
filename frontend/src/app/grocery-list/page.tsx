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
import { EditButton } from "@/components/grocery/edit-button";
import { GroceryHeaderWithChildren } from "@/components/grocery/grocery-header-with-children";
import { GroceryListsFetcher } from "@/components/grocery/grocery-fetcher";
import { GroceryListsUpdater } from "@/components/grocery/grocery-updater";
import { GroceryListDeleter } from "@/components/grocery/grocery-deleter";
import { useUpdateGroceryList } from "@/server/hooks/groceryListHooks";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { showToast } from "@/providers/react-query-provider";

export default function GroceryList() {
  const splitLayout = useGeneralStore((state) => state.splitLayout);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const currentCard = useGroceryStore((state) => state.currentForm);
  const setCurrentForm = useGroceryStore((state) => state.setCurrentForm);

  const groceryItems = useGroceryStore((state) => state.items);
  const setItems = useGroceryStore((state) => state.setItems);
  const isMobile = useGeneralStore((state) => state.isMobile);
  const currentList = useGroceryStore((state) => state.currentList);
  const groceryLists = useGroceryStore((state) => state.groceryLists);
  const setCurrentGroceryLists = useGroceryStore(
    (state) => state.setCurrentGroceryLists
  );

  const { updateGroceryList } = useUpdateGroceryList();

  const handleItemDeletion = () => {
    const uncheckedItems = groceryItems.filter((item) => !item.checked);
    groceryLists.forEach((list) => {
      if (list._id === currentList._id) {
        list.items = uncheckedItems;
        updateGroceryList(list);
      }
    });

    setCurrentGroceryLists(groceryLists);

    setItems(uncheckedItems);
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
        {/* <GroceryListsUpdater /> */}
        <GroceryListDeleter />
        <List />
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
            title={currentList.title}
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
