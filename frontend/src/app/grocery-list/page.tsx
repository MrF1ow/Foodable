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

  const currentCategories = getCurrentGrocerySections();

  let column1, column2, column3;

  if (splitLayout == false) {
    column1 = currentCategories.filter((_, index) => index % 3 === 0);
    column2 = currentCategories.filter((_, index) => index % 3 === 1);
    column3 = currentCategories.filter((_, index) => index % 3 === 2);
  } else if (isMobile == true) {
    column1 = currentCategories;
    column2 = undefined;
    column3 = undefined;
  } else {
    column1 = currentCategories.filter((_, index) => index % 2 === 0);
    column2 = currentCategories.filter((_, index) => index % 2 === 1);
    column3 = undefined;
  }

  const Content = () => {
    return (
      <div>
        <ScrollArea className="w-full h-full">
          <div
            className={`flex flex-wrap gap-4 h-full bg-background ${
              isMobile ? "justify-center" : ""
            }`}
          >
            <div className="flex flex-col gap-4 w-[100%] md:w-[560px]">
              {column1.map((item) => (
                <GroceryAccordion key={item.title} {...item} />
              ))}
            </div>
            {column2 && (
              <div className="flex flex-col gap-4 w-[100%] md:w-[560px]">
                {column2.map((item) => (
                  <GroceryAccordion key={item.title} {...item} />
                ))}
              </div>
            )}
            {column3 && (
              <div className="flex flex-col gap-4 w-[100%] md:w-[560px]">
                {column3.map((item) => (
                  <GroceryAccordion key={item.title} {...item} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
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
      </div>
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
