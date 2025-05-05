"use client";

import { cn } from "@/lib/utils";
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import InputCard from "@/components/InputCard";
import { Button } from "@/components/ui/button";
import { GroceryItem, GroceryList } from "@/types/grocery";
import { useGroceryStore } from "@/stores/grocery/store";
import {
  grocerySectionOptions,
  grocerySections,
} from "@/config/grocery-sections";
import { unitOptions } from "@/config/unit-conversions";
import { showToast } from "@/app/providers";

import { getAddItemFormValidation } from "@/lib/utils/formValidation";
import { insertItemIntoGroceryMap } from "@/lib/utils/listItems";

import { z } from "zod";
import { useGeneralStore } from "@/stores/general/store";
import { useUpdateGroceryList } from "@/server/hooks/groceryListHooks";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { JSX, useState, useEffect } from "react";
import { useUserStore } from "@/stores/user/store";
import { useFetchKrogerProducts } from "@/server/hooks/krogerHooks";
import { KrogerProduct } from "@/types/kroger";
import Image from "next/image";
import { FormName } from "@/lib/constants/forms";
import { useWatch } from "react-hook-form";

interface AddItemFormProps {
  className?: string;
  handleClose?: () => void;
  setCurrentForm: (form: FormName | null) => void;
}

export default function AddItem({
  className,
  handleClose,
  setCurrentForm,
}: AddItemFormProps): JSX.Element {
  const [selectedProductId, setSelectedProductId] = useState<
    string | undefined
  >(undefined);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const isUser = useUserStore((state) => state.isUser);
  const isMobile = useGeneralStore((state) => state.isMobile);
  const categories = grocerySections;

  const currentList = useGroceryStore((state) => state.currentList);
  const groceryMap = useGroceryStore((state) => state.map);
  const selectedCategory = useGroceryStore((state) => state.selectedCategory);
  const setShowPortal = useGeneralStore((state) => state.setShowPortal);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const setMap = useGroceryStore((state) => state.setMap);

  const handleCategoryChange = useGroceryStore(
    (state) => state.setSelectedCategory
  );

  const { updateGroceryList } = useUpdateGroceryList();

  const {
    krogerProducts,
    isLoadingKrogerProducts,
    refetchKrogerProducts,
    errorKrogerProducts,
  } = useFetchKrogerProducts(debouncedTerm);

  const { AddItemFormSchema, defaultValues, resolver } =
    getAddItemFormValidation();

  const form = useForm({
    defaultValues,
    resolver,
  });

  const watchedItemName = useWatch({
    control: form.control,
    name: "itemName",
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(watchedItemName);
      refetchKrogerProducts();
    }, 500);

    return () => clearTimeout(handler);
  }, [watchedItemName, refetchKrogerProducts]);

  async function onSubmit(data: z.infer<typeof AddItemFormSchema>) {
    const newItem: GroceryItem = {
      name: data.itemName,
      quantity: data.quantity,
      unit: data.unit,
      category: selectedCategory,
      checked: false,
      productId: selectedProductId,
    };

    if (!currentList) return;

    const newMap = insertItemIntoGroceryMap(newItem, groceryMap);

    if (!newMap) {
      showToast(
        TOAST_SEVERITY.ERROR,
        "Item Already Exists",
        `${newItem.name} already exists in the list`,
        3000
      );
      return;
    }

    const updatedItems = Array.from(newMap.values());

    const newList = {
      ...currentList,
      items: updatedItems,
    };

    console.log("New List:", newList);

    if (currentList._id && isUser) {
      await updateGroceryList(newList as GroceryList);
    }

    setMap(newMap);

    if (!isUser) {
      console.log("Setting new list for guest user");
      setCurrentList(newList);
    }

    console.log("Current List:", currentList);

    showToast(
      TOAST_SEVERITY.SUCCESS,
      "Item Added",
      `${newItem.quantity} ${newItem.unit} of ${newItem.name} added`,
      3000
    );
  }

  const handleInputClose = () => {
    if (handleClose) {
      handleClose();
    } else {
      setCurrentForm(null);
      setShowPortal(false);
      setSplitLayout(false);
    }
  };

  return (
    <div className={`w-full h-full pl-0 md:pl-4 lg:pl-6 xl:pl-6 ${className}`}>
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
                      <div className="relative">
                        <Input
                          className="!text-xl h-12"
                          placeholder="Enter item name"
                          {...field}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() =>
                            setTimeout(() => setIsFocused(false), 100)
                          }
                          onChange={async (e) => {
                            field.onChange(e.target.value);
                            setSelectedProductId(undefined);
                          }}
                          data-testid="itemName-input"
                        />
                        {isFocused && krogerProducts?.data?.length > 0 && (
                          <div className="absolute bg-primary border shadow max-h-60 overflow-y-auto mt-1 rounded w-full">
                            {krogerProducts.data.map((item: KrogerProduct) => {
                              const image =
                                item.images?.[0]?.sizes?.[0]?.url ?? undefined;
                              const description = item.description ?? undefined;

                              return (
                                <div
                                  key={item.productId}
                                  className="p-2 hover:bg-green-00 cursor-pointer flex items-center gap-2"
                                  onMouseDown={() => {
                                    form.setValue("itemName", description);
                                    form.setValue("quantity", 1);
                                    setSelectedProductId(item.productId);
                                  }}
                                >
                                  {image && (
                                    <Image
                                      width={40}
                                      height={40}
                                      src={image}
                                      alt={description}
                                      className="w-10 h-10"
                                    />
                                  )}
                                  <div className="flex flex-col text-sm">
                                    <p className="font-medium">{description}</p>
                                    <p className="text-gray-500">
                                      {item.brand}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
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
                          type="text"
                          className="!text-xl h-12 w-24"
                          placeholder="Enter quantity"
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                          data-testid="quantity-input"
                          onChange={(e) => {
                            const value = e.target.value.replace(
                              /^0+(?!$)/,
                              ""
                            ); // Remove leading zeros
                            if (value === "" || /^\d+$/.test(value)) {
                              // Allow empty or numeric input
                              field.onChange(value === "" ? "" : Number(value));
                            }
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
                            <DropdownMenuTrigger
                              className="text-xl w- hover:scale-105"
                              data-testid="units-dropdown"
                            >
                              {field.value || "pcs"}
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="max-h-60 m-3 overflow-y-auto">
                              {unitOptions.map((unit) => (
                                <DropdownMenuItem
                                  key={unit}
                                  onClick={() => field.onChange(unit)}
                                  data-testid={`${unit}-dropdown-item`}
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
                          <DropdownMenuTrigger
                            className="text-xl w-40 hover:scale-105"
                            data-testid="category-dropdown"
                          >
                            {selectedCategory ||
                              field.value ||
                              "Select Category"}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="max-h-60 m-3 overflow-y-auto">
                            {categories.map((section) => (
                              <DropdownMenuItem
                                key={section.title}
                                onClick={() => {
                                  field.onChange(section.title);
                                  handleCategoryChange(section.title);
                                }}
                                data-testid={`${section.title}-category-item`}
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
    </div>
  );
}
