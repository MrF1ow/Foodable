"use client";

// Package Imports
import { CiFilter } from "react-icons/ci";
import { IoIosPricetag, IoIosTime } from "react-icons/io";
import { MdNumbers } from "react-icons/md";
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

// Local Imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const FilterButton = () => {
  // if the value of the filter is 0, it means the filter is not applied
  // if the value of the filter is 1, it means the filter is applied for less to more
  // if the value of the filter is -1, it means the filter is applied for more to less
  const [priceFilter, setPriceFilter] = useState<number>(0);
  const [timeFilter, setTimeFilter] = useState<number>(0);
  const [ingredientsFilter, setIngredientsFilter] = useState<number>(0);

  const handleFilterChange = (
    filter: "price" | "time" | "ingredients",
    value: number
  ) => {
    if (filter === "price") setPriceFilter(value);
    if (filter === "time") setTimeFilter(value);
    if (filter === "ingredients") setIngredientsFilter(value);
  };

  const resetFilters = () => {
    setPriceFilter(0);
    setTimeFilter(0);
    setIngredientsFilter(0);
  };

  const submitFilters = () => {
    console.log({
      priceFilter,
      timeFilter,
      ingredientsFilter,
    });
  };

  const preventDropdownClose = (event: Event) => {
    event.preventDefault();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="ml-4 h-10 px-4 rounded-md bg-card-background text-foreground"
        >
          <CiFilter className="mr-2 w-5 h-5" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-auto bg-card-background text-foreground"
        align="start"
      >
        <DropdownMenuLabel>Sort Recipes By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <IoIosPricetag />
            <span>Price</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="bg-card-background text-foreground">
              <DropdownMenuCheckboxItem
                checked={priceFilter === 1}
                onCheckedChange={() => handleFilterChange("price", 1)}
                onSelect={preventDropdownClose}
              >
                Low to High
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={priceFilter === -1}
                onCheckedChange={() => handleFilterChange("price", -1)}
                onSelect={preventDropdownClose}
              >
                High to Low
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <IoIosTime />
            <span>Time</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="bg-card-background text-foreground">
              <DropdownMenuCheckboxItem
                checked={timeFilter === 1}
                onCheckedChange={() => handleFilterChange("time", 1)}
                onSelect={preventDropdownClose}
              >
                Short to Long
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={timeFilter === -1}
                onCheckedChange={() => handleFilterChange("time", -1)}
                onSelect={preventDropdownClose}
              >
                Long to Short
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <MdNumbers />
            <span>Ingredients</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="bg-card-background text-foreground">
              <DropdownMenuCheckboxItem
                checked={ingredientsFilter === 1}
                onCheckedChange={() => handleFilterChange("ingredients", 1)}
                onSelect={preventDropdownClose}
              >
                Fewest to Most
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={ingredientsFilter === -1}
                onCheckedChange={() => handleFilterChange("ingredients", -1)}
                onSelect={preventDropdownClose}
              >
                Most to Fewest
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <div className="flex justify-between space-x-2 mt-2">
          <Button
            variant="destructive"
            className="w-full text-foreground"
            onClick={resetFilters}
          >
            Reset
          </Button>
          <Button
            variant="default"
            className="w-full bg-primary text-foreground"
            onClick={submitFilters}
          >
            Submit
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
