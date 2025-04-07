"use client";

// Package Imports
import React from "react";

import { useGroceryStore } from "@/stores/grocery/store";

export interface GroceryHeaderProps {
  width: string;
}

export const GroceryHeaderMin = ({ width }: GroceryHeaderProps) => {
  const currentList = useGroceryStore((state) => state.currentList);

  if (!currentList) return null;

  return (
    <div
      className={`inline-flex items-center bg-primary font-bold rounded-[0%_0%_75%_0%] rounded-l-lg rounded-tr-lg px-4 py-2 h-full`}
      style={{ width: width }}
    >
      <div
        className="text-foreground text-4xl cursor-pointer outline-none bg-transparent"
        data-testid="grocery-header"
      >
        {currentList.title || "New List"}
      </div>
    </div>
  );
};
