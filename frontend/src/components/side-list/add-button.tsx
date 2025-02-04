"use client";

// Package Imports
import { IoMdAddCircle } from "react-icons/io";

// Local Imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGroceryStore } from "@/stores/grocery/store";
import { split } from "postcss/lib/list";

export const AddButton = () => {
  const setCurrentForm = useGroceryStore((state) => state.setCurrentForm);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IoMdAddCircle size={60} className="text-primary" />
      </DropdownMenuTrigger>

      {/* First dropdown content above the trigger */}
      <DropdownMenuPortal>
        <DropdownMenuContent
          side="left"
          className="flex flex-col space-y-3 items-end justify-center bg-card-background border-none shadow-none"
        >
          <DropdownMenuItem
            className="text-center bg-primary text-foreground rounded-sm"
            onClick={() => setCurrentForm("addItem", false)}
          >
            Add Item
          </DropdownMenuItem>
          <DropdownMenuItem className="text-center bg-primary text-foreground rounded-sm">
            Save List
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};
