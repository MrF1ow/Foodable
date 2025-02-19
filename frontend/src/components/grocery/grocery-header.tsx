import React, { useEffect, useState } from "react";

import { useGroceryStore } from "@/stores/grocery/store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EditButton } from "@/components/grocery/edit-button";
import { GroceryMetaData, SavedGroceryMetaData } from "@/types/saved";

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
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const currentLists = useGroceryStore((state) => state.currentLists);
  const currentList = useGroceryStore((state) => state.currentList);

  const getCurrentMetadata = useGroceryStore(
    (state) => state.getCurrentMetadata
  );
  const [metadata, setMetadata] = useState<
    GroceryMetaData | SavedGroceryMetaData
  >(getCurrentMetadata() as GroceryMetaData | SavedGroceryMetaData);

  const setList = async (item: GroceryMetaData) => {
    if (item._id) {
      setCurrentListById(item._id.toString());
      await fetchFullGroceryList(item._id.toString());
    } else if (!item._id) {
      setCurrentListById();
    }
  };

  const handleDropDownClick = (item: GroceryMetaData) => {
    console.log("item", item);
    setCurrentList(item);
    setList(item);
  };

  const filteredLists =
    metadata._id && currentLists
      ? currentLists.filter((list) => list._id !== metadata._id || !list._id)
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
              <DropdownMenuItem
                key={index}
                onClick={() => handleDropDownClick(list)}
              >
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
