"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { GroceryHeaderWithChildren } from "@/components/common/grocery/grocery-header-with-children";

import { useGroceryStore } from "@/stores/grocery/store";
import { useGeneralStore } from "@/stores/general/store";
import { useUpdateGroceryList } from "@/server/hooks/groceryListHooks";

import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { showToast } from "@/providers/react-query-provider";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { GroceryList } from "@/types/grocery";

export default function GroceryListHeader() {
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const isMobile = useGeneralStore((state) => state.isMobile);

  const setCurrentForm = useGroceryStore((state) => state.setCurrentForm);
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const currentList = useGroceryStore((state) => state.currentList);
  const setOnGroceryForm = useGroceryStore((state) => state.setOnGroceryForm);

  const { updateGroceryList } = useUpdateGroceryList();

  const handleItemDeletion = () => {
    const groceryList = currentList;
    const groceryItems = groceryList?.items;
    if (!groceryItems) return;

    const uncheckedItems = groceryItems.filter((item) => !item.checked);
    groceryList.items = uncheckedItems;
    const newList = { ...groceryList, items: uncheckedItems } as GroceryList;
    setCurrentList(newList);

    // only make the API call if the list is saved and has an id in the database
    if ("_id" in groceryList && groceryList._id) {
      updateGroceryList(groceryList);
    }
    showToast(
      TOAST_SEVERITY.SUCCESS,
      "Deleted",
      `Checked Items have been Removed`,
      3000
    );
  };

  return (
    <GroceryHeaderWithChildren
      width={isMobile ? "60%" : "40%"}
      children={
        <div>
          <Button
            onClick={handleItemDeletion}
            className="mr-2 p-6 bg-destructive rounded-md hover:scale-105 hover:shadow-lg transition-all"
            data-testid="remove-items-button"
          >
            <Icons.delete className="!h-6 !w-6" />
          </Button>
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="!h-10 !w-12 bg-card-background"
                >
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setCurrentForm("addItem", isMobile, setSplitLayout);
                    setOnGroceryForm(true);
                  }}
                  data-testid="dropdown-add-item"
                >
                  Add Item
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setCurrentForm("findPrice", isMobile, setSplitLayout);
                    setOnGroceryForm(true);
                  }}
                  data-testid="dropdown-find-price"
                >
                  Find Price
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setCurrentForm("groceryHelper", isMobile, setSplitLayout);
                    setOnGroceryForm(true);
                  }}
                  data-testid="dropdown-grocery-helper"
                >
                  AI Helper
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() =>
                setCurrentForm("findPrice", isMobile, setSplitLayout)
              }
              className="text-2xl p-6 bg-primary font-bold rounded-md hover:scale-105 hover:shadow-lg transition-all"
              data-testid="find-price-button"
            >
              {"Find Price"}
            </Button>
          )}
        </div>
      }
    />
  );
}
