"use client";

// Package Imports
import { Reorder, motion } from "framer-motion";
import { useState } from "react";

// Local Imports
import { ScrollArea } from "@/components/ui/scroll-area";
import { MainLayout } from "@/layouts/main";
import { ContentLayout } from "@/layouts/content";
import { GeneralHeader } from "@/components/general-header";
import { grocerySections } from "@/config/grocery-sections";
import { GroceryAccordion } from "@/components/grocery/grocery-accordion";
import { InputCard } from "@/components/input-card/input-card";
import { useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createGroceryStore } from "@/stores/grocery-store";

import { Button } from "@/components/ui/button";
import { HeaderWithButton } from "@/components/header-with-button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function GroceryList() {
  const [items, setItems] = useState(grocerySections.slice(0, 6));
  const [splitLayout, setSplitLayout] = useState(true);
  const [currentCard, setCurrentCard] = useState("");

  const handleAddItem = () => {
    setSplitLayout(true);
    setCurrentCard("addItem");
    console.log("Add item button clicked");
  };

  const column1 = items.filter((_, index) => index % 3 === 0);
  const column2 = items.filter((_, index) => index % 3 === 1);
  const column3 = items.filter((_, index) => index % 3 === 2);

  const Content = () => {
    return (
      <ScrollArea className="w-full h-full">
        <Reorder.Group values={items} onReorder={setItems}>
          <motion.div
            className="flex flex-wrap gap-4 h-full bg-background w-full"
            dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
            dragElastic={0.2}
          >
            <div className="flex flex-col gap-4">
              {column1.map((item) => (
                <Reorder.Item
                  value={item}
                  key={item.title} // Use index for unique key
                  drag
                  className="w-full sm:w-1/5 h-auto" // Use responsive widths (1/5 for each item in a row)
                  whileDrag={{ scale: 1.05 }}
                  dragSnapToGrid={true}
                >
                  <GroceryAccordion {...item} handleAddItem={handleAddItem} />
                </Reorder.Item>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {column2.map((item) => (
                <Reorder.Item
                  value={item}
                  key={item.title} // Use index for unique key
                  drag
                  className="w-full sm:w-1/5 h-auto" // Use responsive widths (1/5 for each item in a row)
                  whileDrag={{ scale: 1.05 }}
                  dragSnapToGrid={true}
                >
                  <GroceryAccordion {...item} handleAddItem={handleAddItem} />
                </Reorder.Item>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {column3.map((item) => (
                <Reorder.Item
                  value={item}
                  key={item.title} // Use index for unique key
                  drag
                  className="w-full sm:w-1/5 h-auto" // Use responsive widths (1/5 for each item in a row)
                  whileDrag={{ scale: 1.05 }}
                  dragSnapToGrid={true}
                >
                  <GroceryAccordion {...item} handleAddItem={handleAddItem} />
                </Reorder.Item>
              ))}
            </div>
          </motion.div>
        </Reorder.Group>
      </ScrollArea>
    );
  };

  const groceryStore = createGroceryStore();

  const AddItemCard = () => {
    const form = useForm();

    function onSubmit(data: any) {
      console.log(data);
    }

    const handleInputClose = () => {
      setSplitLayout(false);
      console.log("Close button clicked");
    };

    return (
      <Form {...form}>
        <InputCard
          title="Add Item"
          onClick={handleInputClose}
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
                            {[
                              "Bakery",
                              "Dairy",
                              "Produce",
                              "Meat",
                              "Pantry",
                              "Frozen",
                            ].map((category) => (
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

  const FindPriceCard = () => {
    const form = useForm();

    function onSubmit(data: any) {
      console.log(data);
    }

    const handleInputClose = () => {
      setSplitLayout(false);
      console.log("Close button clicked");
    };

    return (
      <Form {...form}>
        <InputCard
          title="Find Price"
          onClick={handleInputClose}
          content={
            <div className="flex flex-col gap-6 mt-6">
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="flex items-center w-full">
                    <FormLabel className="text-2xl mr-20">
                      Enter Zip Code
                    </FormLabel>
                    <FormControl className="flex-1">
                      <Input
                        className="w-auto"
                        placeholder="Enter Zip Code"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="selectStores"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl">Select Stores</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="store 1" />
                          </FormControl>
                          <FormLabel className="text-lg">Fred Meyer</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="store 2" />
                          </FormControl>
                          <FormLabel className="text-lg">Target</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="store 3" />
                          </FormControl>
                          <FormLabel className="text-lg">Walmart</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="selectStores"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-2xl">Search By</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="store 1" />
                          </FormControl>
                          <FormLabel className="text-lg">
                            Lowest Price
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="store 2" />
                          </FormControl>
                          <FormLabel className="text-lg">
                            Current List
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
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
                Find
              </Button>
            </div>
          }
        />
      </Form>
    );
  };

  const renderRightSideCard = () => {
    switch (currentCard) {
      case "addItem":
        return <AddItemCard />;
      case "findPrice":
        return <FindPriceCard />;
      default:
        return null;
    }
  };

  return (
    <MainLayout
      headerComponent={
        <HeaderWithButton
          title={"Grocery List"}
          width="25%"
          buttonText="Find Price"
        />
      }
    >
      {splitLayout ? (
        <div className="flex h-full w-full">
          <ContentLayout
            split
            leftSide={<Content />}
            rightSide={renderRightSideCard()}
          />
        </div>
      ) : (
        <ContentLayout all={<Content />} />
      )}
    </MainLayout>
  );
}
