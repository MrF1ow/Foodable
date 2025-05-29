"use client";

import { JSX, useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

// Custom hooks and state
import { useGroceryStore } from "@/stores/grocery/store";
import { useSavedItemsStore } from "@/stores/saved/store";
import {
  useAllGroceryLists,
  useCreateGroceryList,
  useDeleteGroceryList,
  useUpdateGroceryList,
} from "@/server/hooks/groceryListHooks";
import {
  useAllSavedItems,
  useCreateSavedItem,
  useUpdateSavedItem,
} from "@/server/hooks/savedItemsHooks";
import { useRemoveAllGroceryListFromAllUsers } from "@/server/hooks/bulkOperationHooks";
import { useFetchUserCurrentList } from "@/server/hooks/userHooks";

import { GroceryList } from "@/types/grocery";
import { SavedItem } from "@/types/saved";
import { showToast } from "@/app/providers";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { capitalizeTitle } from "@/lib/utils/general";
import { useAddListForm } from "@/lib/hooks";
import type { AddListFormValues } from "@/lib/validation/forms/schemas";

export default function GroceryEditButton({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}): JSX.Element {
  const currentList = useGroceryStore((state) => state.currentList);
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const currentCategories = useSavedItemsStore(
    (state) => state.currentCategories
  );

  const [isOpen, setIsOpen] = useState(false);

  const { resolver, defaultValues } = useAddListForm({
    title: currentList ? currentList?.title : "",
  });

  const form = useForm<AddListFormValues>({
    resolver,
    defaultValues,
  });

  useEffect(() => {
    if (currentList && isOpen) {
      form.setValue("title", currentList.title);
    }
  }, [currentList, isOpen]);

  const { refetchGroceryLists } = useAllGroceryLists({
    metadata: true,
    enabled: true,
  });
  const { refetchCurrentListId } = useFetchUserCurrentList({ enabled: true });
  const { refetchSavedItems } = useAllSavedItems({ enabled: true });
  const { updateGroceryList } = useUpdateGroceryList();
  const { createGroceryList } = useCreateGroceryList();
  const { deleteGroceryList } = useDeleteGroceryList();
  const { updateSavedItem } = useUpdateSavedItem();
  const { createSavedItem } = useCreateSavedItem();
  const { removeAllGroceryListFromAllUsers } =
    useRemoveAllGroceryListFromAllUsers();

  const onSubmit = async (values: AddListFormValues) => {
    const { title, category } = values;
    const currentGroceryList = currentList;
    if (!currentGroceryList) return;

    const updatedList: GroceryList = {
      ...currentGroceryList,
      title,
    };

    try {
      if (currentList._id) {
        if (currentList.title !== title) {
          await updateGroceryList(updatedList);
          showToast(
            TOAST_SEVERITY.SUCCESS,
            "List Updated",
            "Grocery list updated successfully",
            3000
          );
          setCurrentList(updatedList);
        }

        const savedItem: SavedItem = {
          ...updatedList,
          type: "groceryList",
          category,
        };

        await updateSavedItem(savedItem);
        showToast(
          TOAST_SEVERITY.SUCCESS,
          "Saved",
          "Grocery list saved successfully",
          3000
        );
      } else {
        const newSavedList = {
          ...updatedList,
          type: "groceryList",
          category,
        };

        const createData = await createGroceryList(updatedList);
        setCurrentList(createData);
        await createSavedItem(newSavedList as SavedItem);

        showToast(
          TOAST_SEVERITY.SUCCESS,
          "List Created",
          "Grocery list created successfully",
          3000
        );
      }

      await refetchGroceryLists();
      await refetchSavedItems();
      setIsOpen(false);
    } catch (err) {
      showToast(TOAST_SEVERITY.ERROR, "Error", "Something went wrong", 3000);
    }
  };

  const handleDeleteList = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!currentList) return;

    deleteGroceryList(currentList._id.toString(), {
      onSuccess: async () => {
        showToast(
          TOAST_SEVERITY.INFO,
          "Deleting List",
          "Deleting grocery list...",
          3000
        );
        await removeAllGroceryListFromAllUsers(currentList._id.toString());
        await refetchCurrentListId();
        await refetchGroceryLists();
        await refetchSavedItems();

        showToast(
          TOAST_SEVERITY.SUCCESS,
          "List Deleted",
          "Grocery list deleted successfully",
          3000
        );
        setCurrentList({
          _id: null,
          creatorId: null,
          title: "New List",
          items: [],
        });
        setIsOpen(false);
      },
      onError: (error) => {
        showToast(
          TOAST_SEVERITY.ERROR,
          "Error",
          error.message || "Error deleting list",
          3000
        );
      },
    });
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
          data-testid="edit-grocery-list"
        >
          <MdEdit className="text-foreground" />
          {children}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Grocery List</DialogTitle>
          <DialogDescription>
            Update the title and category for this list.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      data-testid="list-title"
                      placeholder="Enter title"
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
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currentCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {capitalizeTitle(cat)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex w-full justify-between gap-4">
              {currentList?._id && (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={handleDeleteList}
                  data-testid="list-delete"
                >
                  Delete
                </Button>
              )}
              <Button type="submit" data-testid="list-submit">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
