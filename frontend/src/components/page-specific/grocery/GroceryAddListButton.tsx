"use client";

import { JSX, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Icons } from "@/components/ui/icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { useGroceryStore } from "@/stores/grocery/store";
import { useSavedItemsStore } from "@/stores/saved/store";
import {
  useAllGroceryLists,
  useCreateGroceryList,
} from "@/server/hooks/groceryListHooks";
import { useCreateSavedItem } from "@/server/hooks/savedItemsHooks";
import { useUpdateUserCurrentList } from "@/server/hooks/userHooks";

import { GroceryList } from "@/types/grocery";
import { SavedItem } from "@/types/saved";
import { showToast } from "@/app/providers";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { capitalizeTitle } from "@/lib/utils/general";

import { useAddListForm } from "@/lib/hooks/useAddListForm";
import { AddListFormSchema } from "@/lib/validation/forms/schemas/addListSchema";

type AddListFormValues = z.infer<typeof AddListFormSchema>;

export default function GroceryAddButton({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}): JSX.Element {
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const currentList = useGroceryStore((state) => state.currentList);
  const currentCategories = useSavedItemsStore((state) => state.currentCategories);

  const [isOpen, setIsOpen] = useState(false);

  const { updateUserCurrentList } = useUpdateUserCurrentList();
  const { refetchGroceryLists } = useAllGroceryLists({
    metadata: true,
    enabled: true,
  });
  const { createGroceryList } = useCreateGroceryList();
  const { createSavedItem } = useCreateSavedItem();

  const { resolver, defaultValues } = useAddListForm({ title: "" });

  const form = useForm<AddListFormValues>({
    resolver,
    defaultValues,
  });

  const onSubmit = async (values: AddListFormValues) => {
    const { title, category } = values;

    if (!title.trim()) {
      showToast(TOAST_SEVERITY.ERROR, "Error", "Title cannot be empty", 3000);
      return;
    }

    if (!category) {
      showToast(TOAST_SEVERITY.ERROR, "Error", "You must select a category", 3000);
      return;
    }

    const newList: GroceryList = {
      _id: null,
      creatorId: null,
      title: title.trim(),
      items: currentList ? currentList?.items : [],
    };

    const createData = await createGroceryList(newList);

    if (!createData) {
      showToast(TOAST_SEVERITY.ERROR, "Error", "Failed to create grocery list", 3000);
      return;
    }

    const newSaveItem: SavedItem = {
      _id: createData._id,
      title: createData.title,
      type: "groceryList",
      category,
    };

    const savedItem = await createSavedItem(newSaveItem);

    if (!savedItem) {
      showToast(TOAST_SEVERITY.ERROR, "Error", "Failed to save grocery list", 3000);
      return;
    }

    await updateUserCurrentList(createData._id);
    setCurrentList(createData);

    await refetchGroceryLists();
    form.reset(); // optional
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-accent rounded-sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          data-testid="add-grocery-list"
          aria-label="Add new grocery list"
        >
          <FaPlus className="text-foreground" />
          {children}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Grocery List</DialogTitle>
          <DialogDescription>
            Give your new grocery list a title and category.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter list title..."
                      data-testid="new-list-title"
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
                <FormItem>
                  <FormLabel className="sr-only">Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {capitalizeTitle(cat)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4 flex justify-end space-x-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                data-testid="submit-new-grocery-list"
                disabled={!form.watch("title").trim() || !form.watch("category")}
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

