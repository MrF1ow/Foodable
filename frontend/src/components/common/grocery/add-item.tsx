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
import { InputCard } from "@/components/common/input-card/input-card";
import { Button } from "@/components/ui/button";
import { GroceryItem, GroceryList } from "@/types/grocery";
import { useGroceryStore } from "@/stores/grocery/store";
import { grocerySections } from "@/config/grocery-sections";
import { unitOptions } from "@/config/unit-conversions";
import { showToast } from "@/providers/react-query-provider";

import { getAddItemFormValidation } from "@/utils/formValidation";

import { z } from "zod";
import { useGeneralStore } from "@/stores/general/store";
import { useUpdateGroceryList } from "@/server/hooks/groceryListHooks";
import { TOAST_SEVERITY } from "@/lib/constants/ui";

export const AddItem = ({ className }: { className?: string }) => {
  const isMobile = useGeneralStore((state) => state.isMobile);
  const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
  const categories = grocerySections;

  const currentList = useGroceryStore((state) => state.currentList);
  const selectedCategory = useGroceryStore((state) => state.selectedCategory);
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const setCurrentForm = useGroceryStore((state) => state.setCurrentForm);

  const handleCategoryChange = useGroceryStore(
    (state) => state.setSelectedCategory
  );
  const {
    updateGroceryList,
    updatedGroceryList,
    isUpdatingGroceryList,
    updateError,
  } = useUpdateGroceryList();

  const { AddItemFormSchema, defaultValues, resolver } =
    getAddItemFormValidation();

  const form = useForm({
    defaultValues,
    resolver,
  });

  async function onSubmit(data: z.infer<typeof AddItemFormSchema>) {
    const newItem: GroceryItem = {
      name: data.itemName,
      quantity: data.quantity,
      unit: data.unit,
      category: selectedCategory,
      checked: false,
    };

    const list = currentList as GroceryList;

    if (!list) return;

    const newList = { ...list, items: [...list.items, newItem] };

    if (list._id) {
      updateGroceryList(newList as GroceryList);
      if (isUpdatingGroceryList) {
        showToast(
          TOAST_SEVERITY.INFO,
          "Updating List",
          "Updating grocery list...",
          3000
        );
      }
      if (updateError) {
        showToast(
          TOAST_SEVERITY.ERROR,
          "Error",
          updateError.message || "Error updating list",
          3000
        );
      }
      showToast(
        TOAST_SEVERITY.SUCCESS,
        "List Updated",
        "Grocery list updated successfully",
        3000
      );
      if (updatedGroceryList) {
        setCurrentList(updatedGroceryList);
      }
    } else {
      setCurrentList(newList);
    }

    showToast(
      TOAST_SEVERITY.SUCCESS,
      "Item Added",
      `${newItem.quantity} ${newItem.unit} of ${newItem.name} added`,
      3000
    );
  }

  const handleInputClose = () => {
    setCurrentForm("", isMobile, setSplitLayout);
  };

  return (
    <div className={cn(className)}>
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
};
