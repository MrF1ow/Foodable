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
import { useUpdateUserCurrentList } from "@/server/hooks/userHooks";
import {
  GroceryList,
  GroceryListIdentifier,
  NewGroceryList,
} from "@/types/grocery";

export interface GroceryHeaderProps {
  width: string;
}

export const GroceryHeader = ({ width }: GroceryHeaderProps) => {
  const currentList = useGroceryStore((state) => state.currentList);
  const availableLists = useGroceryStore((state) => state.availableLists);
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const setOpenAccordion = useGroceryStore((state) => state.setCurrentSections);

  const { updateUserCurrentList } = useUpdateUserCurrentList();

  if (!currentList) return null;

  const handleListChange = async (item: GroceryListIdentifier) => {
    await updateUserCurrentList(item.id);
    const newList = {
      ...currentList,
      _id: item.id,
      title: item.title,
    };
    setCurrentList(newList);
    setOpenAccordion([]);
  };

  const filteredLists = currentList._id
    ? availableLists.filter(
        (list: GroceryListIdentifier) =>
          list.id !== currentList._id || currentList._id === null
      )
    : availableLists;

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
            filteredLists.map((list: GroceryListIdentifier) => (
              <DropdownMenuItem
                key={list.id}
                onClick={() => handleListChange(list)}
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
