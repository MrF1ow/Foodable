"use client";

// Package Imports
import React from "react";

// Local Imports
import { useGroceryStore } from "@/stores/grocery/store";
import { SavedGroceryMetaData } from "@/types/saved";
import { Box } from "@/components/common/box";
import { GroceryList, GroceryItem } from "@/types/grocery";
import { useUpdateUserCurrentList } from "@/server/hooks/userHooks";
import { useFetchGroceryListById } from "@/server/hooks/groceryListHooks";
import { isValidObjectId } from "@/utils/typeValidation/general";

interface GroceryBoxProps {
  handleBoxClick: () => void;
  data: SavedGroceryMetaData;
}

export const GroceryBox = ({ handleBoxClick, data }: GroceryBoxProps) => {
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
    handleBoxClick();
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
