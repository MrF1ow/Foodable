"use client";

// Package Imports
import React, { JSX } from "react";

// Local Imports
import { useGroceryStore } from "@/stores/grocery/store";
import { SavedGroceryMetaData } from "@/types/saved";
import Box from "@/components/Box";
import { GroceryList, GroceryItem } from "@/types/grocery";
import { useUpdateUserCurrentList } from "@/server/hooks/userHooks";

interface GroceryBoxProps {
  handleBoxClick: () => void;
  data: SavedGroceryMetaData;
  width: string;
}

export default function GroceryBox({
  handleBoxClick,
  data,
  width,
}: GroceryBoxProps): JSX.Element {
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const { updateUserCurrentList } = useUpdateUserCurrentList();

  if (!data) return <></>;

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
      <Box key={data._id.toString()} onClick={handleGroceryClick} width={width}>
        {/* Make this a Hover Box */}
        <div
          className="h-full w-full flex justify-center items-center"
          data-testid={`grocery-box-${data.title}`}
        >
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold truncate">
            {data.title}
          </h3>
        </div>
      </Box>
    </>
  );
}
