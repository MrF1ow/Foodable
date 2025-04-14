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
import { useGeneralStore } from "@/stores/general/store";
import { FORM_NAMES } from "@/lib/constants/forms";
import { JSX } from "react";

export default function SideListAddButton(): JSX.Element {
  const setCurrentForm = useGeneralStore((state) => state.setCurrentForm);
  const setShowPortal = useGeneralStore((state) => state.setShowPortal);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);

  const handleButtonClick = () => {
    setCurrentForm(FORM_NAMES.ADD_ITEM_TO_LIST);
    setShowPortal(true);
    setSplitLayout(true);
  }
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
            onClick={handleButtonClick}
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
