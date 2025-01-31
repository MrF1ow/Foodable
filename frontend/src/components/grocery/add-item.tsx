import { useState } from "react";
import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InputCard } from "@/components/input-card/input-card";
import { Button } from "@/components/ui/button";
import {
  GroceryItem,
  GrocerySection,
  GrocerySectionOptions,
} from "@/types/grocery";
import { useGroceryStore } from "@/stores/grocery/store";
import { unitOptions, unitsAsTuple } from "@/config/unit-conversions";

import { z } from "zod";
import { useGeneralStore } from "@/stores/general/store";

interface AddItemCardProps {
  setSplitLayout: (value: boolean) => void;
  categories: GrocerySection[];
}

export const AddItem = ({ setSplitLayout, categories }: AddItemCardProps) => {
  const prevItems = useGroceryStore((state) => state.items);
  const setItems = useGroceryStore((state) => state.setItems);
  const selectedCategory = useGroceryStore(
    (state) => state.selectedCategory as GrocerySectionOptions
  );
  const handleCategoryChange = useGroceryStore(
    (state) => state.setSelectedCategory
  );
  const isMobile = useGeneralStore((state) => state.isMobile);
  const schema = z.object({
    itemName: z
      .string()
      .min(3, "Item name must be at least 3 characters long")
      .max(50, "Item name must be less than 50 characters long"),
    quantity: z
      .number()
      .min(1, "Quantity must be at least 1")
      .max(100, "Quantity must be less than 100"),
    category: z.string().min(1, "Category is required"),
    unit: z.enum(unitsAsTuple), // Uses unitOptions array
  });

  const form = useForm({
    defaultValues: {
      itemName: "",
      quantity: 1,
      unit: unitsAsTuple[0],
      category: selectedCategory,
    },
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    console.log("Unit", data.unit);
    const newItem: GroceryItem = {
      id: `${selectedCategory}-${data.itemName}-${Math.random().toString(36)}`, // Unique id based on section and a random string
      name: data.itemName,
      quantity: data.quantity,
      unit: data.unit,
      category: selectedCategory,
      checked: false,
    };
    setItems([...prevItems, newItem]);
  }

  const handleInputClose = () => {
    setSplitLayout(false);
  };

  return (
    <Form {...form}>
      <InputCard
        title="Add Item"
        onClick={handleInputClose}
        content={
          <div className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-2xl">Item Name</FormLabel>
                  <FormControl>
                    <Input
                      className="!text-xl h-12"
                      placeholder="Enter item name"
                      {...field}
                      data-testid="itemName-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div
              className={`flex ${
                isMobile ? "justify-center" : ""
              } items-center`}
            >
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="mr-8">
                    <FormLabel className="text-2xl">Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="!text-xl h-12 w-24"
                        placeholder="Enter quantity"
                        {...field}
                        data-testid="quantity-input"
                        onChange={(e) => {
                          // Parse value as a number
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl">Select Unit</FormLabel>
                    <div className="border rounded shadow-sm p-2">
                      <FormControl>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="text-xl w- hover:scale-105">
                            {field.value || "pcs"}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="max-h-60 m-3 overflow-y-auto">
                            {unitOptions.map((unit) => (
                              <DropdownMenuItem
                                key={unit}
                                onClick={() => field.onChange(unit)}
                              >
                                {unit}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-2xl">Select Category</FormLabel>
                  <div className="border rounded shadow-sm w-40 py-2">
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="text-xl w-40 hover:scale-105">
                          {selectedCategory || field.value || "Select Category"}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="max-h-60 m-3 overflow-y-auto">
                          {categories.map((section) => (
                            <DropdownMenuItem
                              key={section.title}
                              onClick={() => {
                                field.onChange(section.title);
                                handleCategoryChange(section.title);
                              }}
                            >
                              {section.title}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        }
        footer={
          <div className="flex justify-center ">
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              className="btn-primary p-8 text-3xl transition-all hover:scale-105 hover:shadow-lg"
              data-testid="submit-button"
            >
              Submit
            </Button>
          </div>
        }
      />
    </Form>
  );
};
