"use client";

import { InputCard } from "@/components/input-card/input-card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { unitOptions, unitsAsTuple } from "@/config/unit-conversions";
import {
  grocerySectionOptions,
  grocerySectionsAsTuple,
} from "@/config/grocery-sections";
import { useGroceryStore } from "@/stores/grocery/store";
import { GroceryItem } from "@/types/grocery";

export const AddItem = () => {
  const prevItems = useGroceryStore((state) => state.items);
  const setItems = useGroceryStore((state) => state.setItems);

  const formSchema = z.object({
    itemName: z.string().min(2).max(50),
    quantity: z.number().min(1).max(100),
    unit: z.enum(unitsAsTuple), // Uses unitOptions array
    category: z.enum(grocerySectionsAsTuple), // Uses grocerySectionOptions array
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
      quantity: 0,
      unit: "pcs",
      category: "Bakery",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newItem: GroceryItem = {
      name: values.itemName,
      quantity: values.quantity,
      unit: values.unit,
      category: values.category,
    };

    const newList = [...prevItems, newItem];

    setItems(newList);

    console.log(newItem);
  }

  return (
    <Form {...form}>
      <InputCard
        title="Add Item"
        content={
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter item name" {...field} />
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
                  <FormLabel className="text-xl">Quantity</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quantity" {...field} />
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
                  <FormLabel className="text-xl">Select Unit</FormLabel>
                  <div className="border rounded shadow-sm p-2">
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          {field.value || "pcs"}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
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
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">Select Category</FormLabel>
                  <div className="border rounded shadow-sm p-2">
                    <FormControl>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          {field.value || "Bakery"}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {grocerySectionOptions.map((category) => (
                            <DropdownMenuItem
                              key={category}
                              onClick={() => field.onChange(category)}
                            >
                              {category}
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
              className="btn-primary p-8 text-3xl"
            >
              Submit
            </Button>
          </div>
        }
      />
    </Form>
  );
};
