"use client";

// Package Imports
import React, { useEffect, useState } from "react";

// Local Imports
import { useGroceryStore } from "@/stores/grocery/store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { EditButton } from "@/components/common/grocery/edit-button";
import { useAllGroceryLists } from "@/server/hooks/groceryListHooks";
import { GroceryList, NewGroceryList } from "@/types/grocery";

export interface GroceryHeaderProps {
  width: string;
}

export const GroceryHeader = ({ width }: GroceryHeaderProps) => {
  const currentList = useGroceryStore((state) => state.currentList);
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const setOpenAccordion = useGroceryStore((state) => state.setCurrentSections);

  const [allLists, setAllLists] = useState<GroceryList[]>([]);

  const { groceryLists = [] } = useAllGroceryLists({
    metadata: true,
    enabled: true,
  });

  useEffect(() => {
    const newList: NewGroceryList = {
      _id: null,
      creatorId: null,
      title: "New List",
      items: [],
    };

    const allLists = [newList, ...groceryLists];
    setAllLists(allLists);
  }, [groceryLists]);

  const setList = async (item: GroceryList) => {
    setOpenAccordion([]);
    setCurrentList(item);
  };

  if (!currentList) return null;

  const filteredLists = currentList._id
    ? allLists.filter(
        (list: GroceryList) =>
          list._id !== currentList._id || currentList._id === null
      )
    : allLists;

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
          {currentList.title || "New List"}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {filteredLists.length > 0 ? (
            filteredLists.map((list: GroceryList) => (
              <DropdownMenuItem key={list._id} onClick={() => setList(list)}>
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
