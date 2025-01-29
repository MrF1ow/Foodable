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
import { GroceryItem, GrocerySection } from "@/types/grocery";
import { useGroceryStore } from "@/stores/grocery/store";

import * as z from "zod";

interface AddItemCardProps {
  setSplitLayout: (value: boolean) => void;
  categories: GrocerySection[];
  selectedCategory: string;
  handleCategoryChange: (category: string) => void;
  addItem: (newItem: GroceryItem) => void;
}

export const AddItem = ({
  setSplitLayout,
  categories,
  selectedCategory,
  handleCategoryChange,
  addItem,
}: AddItemCardProps) => {
  const schema = z.object({
    itemName: z.string().min(3, "Item name must be at least 3 characters long"),
    quantity: z.string().min(1, "Quantity must be at least 1"),
    category: z.string().min(1, "Category is required"),
  });

  const form = useForm({
    defaultValues: {
      itemName: "",
      quantity: "",
      category: selectedCategory,
    },
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    const newItem: GroceryItem = {
      id: `${selectedCategory}-${data.itemName}-${Math.random().toString(36)}`, // Unique id based on section and a random string
      name: data.itemName,
      quantity: 0,
      unit: "pcs",
      category: "Bakery",
      checked: false,
    };
    addItem(newItem);
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
          <div className="flex flex-col gap-6 mt-6">
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-2xl">Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="!text-xl h-12 "
                      placeholder="Enter quantity"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-4">
                  <FormLabel className="text-2xl">Select Category</FormLabel>
                  <div className="border rounded shadow-sm p-2">
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
            >
              Submit
            </Button>
          </div>
        }
      />
    </Form>
  );
};
