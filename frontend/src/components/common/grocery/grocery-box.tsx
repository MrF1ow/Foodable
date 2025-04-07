"use client";

// Package Imports
import React from "react";

// Local Imports
import { useGroceryStore } from "@/stores/grocery/store";
import { SavedGroceryMetaData } from "@/types/saved";
import { Box } from "@/components/common/box";
import { GroceryList, GroceryItem } from "@/types/grocery";
import { useUpdateUserCurrentList } from "@/server/hooks/userHooks";

interface GroceryBoxProps {
  setOpen: ((isOpen: boolean) => void) | ((isOpen: boolean) => void | any);
  data: SavedGroceryMetaData;
}

export const GroceryBox = ({ setOpen, data }: GroceryBoxProps) => {
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const { updateUserCurrentList } = useUpdateUserCurrentList();

  if (!data) return null;

  const handleGroceryClick = async () => {
    const { category, type, ...rest } = data;
    const newList = {
      ...rest,
      items: [] as GroceryItem[],
    };
    await updateUserCurrentList(newList._id.toString());
    setCurrentList(newList as GroceryList);
    setOpen(true);
  };

  return (
    <>
      <Box key={data._id.toString()} onClick={handleGroceryClick}>
        {/* Make this a Hover Box */}
        <h3 className="text-lg font-semibold truncate">{data.title}</h3>
      </Box>
    </>
  );
};
