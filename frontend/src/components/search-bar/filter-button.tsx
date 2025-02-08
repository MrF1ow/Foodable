"use client";

// Package Imports
import { CiFilter } from "react-icons/ci";
import { IoIosPricetag, IoIosTime } from "react-icons/io";
import { MdNumbers } from "react-icons/md";

// Local Imports
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useGeneralStore } from "@/stores/general/store";
import { FilterOptions } from "@/types";

interface FilterButtonProps {
  setFilters: (filters: FilterOptions) => void;
  filter: FilterOptions;
}

export const FilterButton = ({ setFilters, filter }: FilterButtonProps) => {
  const isMobile = useGeneralStore((state) => state.isMobile);

  const handleFilterChange = (
    filterType: "price" | "timeApprox" | "ingredientAmount",
    value: -1 | 0 | 1
  ) => {
    // Update filter state in zustand store
    const updatedFilter = {
      searchQuery: filter.searchQuery,
      price: filterType === "price" ? value : 0,
      timeApprox: filterType === "timeApprox" ? value : 0,
      ingredientAmount: filterType === "ingredientAmount" ? value : 0,
    };

    setFilters(updatedFilter);
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      price: 0,
      timeApprox: 0,
      ingredientAmount: 0,
    });
  };

  const preventDropdownClose = (event: Event) => {
    event.preventDefault();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isMobile ? (
          <Button className="ml-4 h-10 px-4 rounded-md bg-card-background text-foreground">
            <CiFilter className="w-5 h-5" />
          </Button>
        ) : (
          <Button
            variant="outline"
            className="ml-4 h-10 px-4 rounded-md bg-card-background text-foreground"
          >
            <CiFilter className="mr-2 w-5 h-5" />
            Filter
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-full bg-card-background text-foreground"
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
                checked={filter.price === 1}
                onCheckedChange={() => handleFilterChange("price", 1)}
                onSelect={preventDropdownClose}
              >
                Low to High
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.price === -1}
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
                checked={filter.timeApprox === 1}
                onCheckedChange={() => handleFilterChange("timeApprox", 1)}
                onSelect={preventDropdownClose}
              >
                Short to Long
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.timeApprox === -1}
                onCheckedChange={() => handleFilterChange("timeApprox", -1)}
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
                checked={filter.ingredientAmount === 1}
                onCheckedChange={() =>
                  handleFilterChange("ingredientAmount", 1)
                }
                onSelect={preventDropdownClose}
              >
                Fewest to Most
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filter.ingredientAmount === -1}
                onCheckedChange={() =>
                  handleFilterChange("ingredientAmount", -1)
                }
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
          {/* <Button
            variant="default"
            className="w-full bg-primary text-foreground"
          >
            Submit
          </Button> */}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
