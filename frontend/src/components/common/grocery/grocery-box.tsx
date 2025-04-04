"use client";

// Package Imports
import Image from "next/image";
import React from "react";

// Local Imports
import { useGroceryStore } from "@/stores/grocery/store";
import { SavedGroceryMetaData } from "@/types/saved";
import { Box } from "@/components/common/box";
import { GroceryList, GroceryItem } from "@/types/grocery";
import { rest } from "node_modules/cypress/types/lodash";

interface GroceryBoxProps {
  setOpen: ((isOpen: boolean) => void) | ((isOpen: boolean) => void | any);
  data: SavedGroceryMetaData;
}

export const GroceryBox = ({ setOpen, data }: GroceryBoxProps) => {
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);

  if (!data) return null;

  const handleGroceryClick = async () => {
    const { category, type, ...rest } = data;
    const newList = {
      ...rest,
      items: [] as GroceryItem[],
    };
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
