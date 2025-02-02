"use client";

// Local Imports
import { ScrollArea } from "@/components/ui/scroll-area";
import { MainLayout } from "@/layouts/main";
import { ContentLayout } from "@/layouts/content";
import { GroceryAccordion } from "@/components/grocery/grocery-accordion";
import { HeaderWithChildren } from "@/components/header-with-children";
import { AddItem } from "@/components/grocery/add-item";
import { FindPrice as FindPrice } from "@/components/grocery/find-price";
import { HelperCard } from "@/components/grocery/list-helper";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { useGroceryStore } from "@/stores/grocery/store";
import { useGeneralStore } from "@/stores/general/store";
import { getCurrentGrocerySections } from "@/utils/listItems";
import { List } from "@/components/grocery/list";

export default function GroceryList() {
  const splitLayout = useGeneralStore((state) => state.splitLayout);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const currentCard = useGroceryStore((state) => state.currentForm);
  const setCurrentForm = useGroceryStore((state) => state.setCurrentForm);

  const groceryItems = useGroceryStore((state) => state.items);
  const setItems = useGroceryStore((state) => state.setItems);
  const isMobile = useGeneralStore((state) => state.isMobile);

  const handleItemDeletion = () => {
    const uncheckedItems = groceryItems.filter((item) => !item.checked);

    setItems(uncheckedItems);
  };

  const Content = () => {
    return (
      <>
        <List />
        {!splitLayout && (
          <Button
            className={`btn-primary rounded-full w-12 h-12 hover:bg-primary flex items-center justify-center fixed bottom-4 right-4 z-50 ${
              isMobile ? "mb-16" : ""
            }`}
            data-testid="helper-button"
            onClick={() =>
              setCurrentForm("groceryHelper", setSplitLayout, isMobile)
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
        return <AddItem />;
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
          <HeaderWithChildren
            title={"Grocery List"}
            width="25%"
            children={
              <div className="flex items-center justify-center">
                <Button
                  onClick={handleItemDeletion}
                  className="mx-6 p-6 bg-destructive rounded-md hover:scale-105 hover:shadow-lg transition-all"
                >
                  <Icons.delete className="!h-6 !w-6" />
                </Button>
                <Button
                  onClick={() =>
                    setCurrentForm("findPrice", setSplitLayout, isMobile)
                  }
                  className="text-2xl p-6 bg-primary font-bold rounded-md hover:scale-105 hover:shadow-lg transition-all"
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
