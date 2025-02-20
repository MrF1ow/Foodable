// Package Imports
import React from "react";

// Local Imports
import { useGroceryStore } from "@/stores/grocery/store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EditButton } from "@/components/common/grocery/edit-button";
import { GroceryMetaData } from "@/types/saved";

export interface GroceryHeaderProps {
  width: string;
}

export const GroceryHeader = ({ width }: GroceryHeaderProps) => {
  const setCurrentListById = useGroceryStore(
    (state) => state.setCurrentGroceryListId
  );
  const fetchFullGroceryList = useGroceryStore(
    (state) => state.fetchFullGroceryList
  );
  const setOpenAccordion = useGroceryStore((state) => state.setCurrentSections);
  const currentLists = useGroceryStore((state) => state.currentLists);
  const currentList = useGroceryStore((state) => state.currentList);

  const setList = async (item: GroceryMetaData) => {
    setOpenAccordion([]);
    if (item._id) {
      setCurrentListById(item._id.toString());
      await fetchFullGroceryList(item._id.toString());
    } else if (!item._id) {
      setCurrentListById();
    }
  };

  if (!currentList) return null;

  console.log("currentLists", currentLists);

  const filteredLists = currentList.metadata?._id
    ? currentLists.filter((list) => list._id !== currentList.metadata?._id)
    : currentLists;

  return (
    <div
      className={`inline-flex items-center bg-primary font-bold rounded-[0%_0%_75%_0%] rounded-l-lg rounded-tr-lg px-4 py-2 h-full`}
      style={{ width: width }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          className="text-foreground text-4xl cursor-pointer outline-none bg-transparent"
          data-testid="grocery-header"
        >
          {currentList.metadata?.title || "New List"}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {filteredLists.length > 0 ? (
            filteredLists.map((list, index) => (
              <DropdownMenuItem key={index} onClick={() => setList(list)}>
                {list.title}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>No lists available</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <span>
        <EditButton />
      </span>
    </div>
  );
};
