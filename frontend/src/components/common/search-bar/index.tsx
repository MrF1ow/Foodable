import React from "react";

import { IoIosSearch } from "react-icons/io";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  FilterButton?: React.ComponentType;
}

export const SearchBar = ({
  searchQuery,
  setSearchQuery,
  FilterButton,
}: SearchBarProps) => {
  return (
    <div className="flex items-center w-full max-w-md">
      <div className="relative flex-1">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find Recipes..."
          className="pl-10 pr-20 h-10 rounded-md bg-card-background text-foreground focus:outline-none"
        />
        <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-card-background text-foreground" />
      </div>
      {FilterButton && <FilterButton />}
    </div>
  );
};
