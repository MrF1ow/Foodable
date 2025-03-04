"use client";

// Package Imports
import { MdEdit } from "react-icons/md";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

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
import { useGroceryStore } from "@/stores/grocery/store";
import {
  useAllGroceryLists,
  useCreateGroceryList,
  useDeleteGroceryList,
  useUpdateGroceryList,
} from "@/server/hooks/groceryListHooks";
import { GroceryList } from "@/types/grocery";
import { GROCERY_LISTS } from "@/lib/constants/process";
import { showToast } from "@/providers/react-query-provider";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { getQueryClient } from "@/app/get-query-client";

export const EditButton = () => {
  const queryClient = getQueryClient();

  const currentList = useGroceryStore((state) => state.currentList);
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);

  const [newTitle, setNewTitle] = useState(currentList?.title || "");
  const [isOpen, setIsOpen] = useState(false);

  const {
    updateGroceryList,
    updatedGroceryList,
    isUpdatingGroceryList,
    updateError,
  } = useUpdateGroceryList();
  const { createGroceryList, isCreatingGroceryList, createError, createData } =
    useCreateGroceryList();
  const { deleteGroceryList } = useDeleteGroceryList();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentGroceryList = currentList;

    if (!currentGroceryList) return;

    const newList = {
      ...currentGroceryList,
      title: newTitle,
    };

    console.log("Edit Button Current List", currentList);

    if (currentList.title !== newTitle && currentList._id) {
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
      setCurrentList(newList);
    } else {
      const newCreateList = {
        ...newList,
        creatorId: "000000000000000000000000", // Placeholder for now
      };
      createGroceryList(newCreateList as GroceryList);
      if (isCreatingGroceryList) {
        showToast(
          TOAST_SEVERITY.INFO,
          "Creating List",
          "Creating grocery list...",
          3000
        );
      }
      if (createError) {
        showToast(
          TOAST_SEVERITY.ERROR,
          "Error",
          createError.message || "Error creating list",
          3000
        );
      }
      showToast(
        TOAST_SEVERITY.SUCCESS,
        "List Created",
        "Grocery list created successfully",
        3000
      );

      console.log(createData);
      setCurrentList(newCreateList);
      console.log("New List", newCreateList);
    }

    setIsOpen(false);
  };

  const handleDeleteList = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!currentList) return;

    deleteGroceryList(currentList._id.toString(), {
      onSuccess: () => {
        showToast(
          TOAST_SEVERITY.INFO,
          "Deleting List",
          "Deleting grocery list...",
          3000
        );

        // After deletion, invalidate and refetch the grocery lists
        queryClient.invalidateQueries({ queryKey: [GROCERY_LISTS] });

        showToast(
          TOAST_SEVERITY.SUCCESS,
          "List Deleted",
          "Grocery list deleted successfully",
          3000
        );

        const newList = {
          _id: null,
          creatorId: null,
          title: "New List",
          items: [],
        };
        setCurrentList(newList); // Clear the current list
        setIsOpen(false); // Close the dialog
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
      <DialogTrigger className="ml-4" asChild>
        <MdEdit
          size={40}
          className="text-foreground"
          data-testid="list-edit"
          onClick={(event) => {
            event.stopPropagation();
            setIsOpen(true);
          }}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Grocery List Title</DialogTitle>
          <DialogDescription>
            Make changes to your grocery list title. Click submit when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center space-x-2">
            <Label htmlFor="name" className="sr-only">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="High Protein .."
              data-testid="list-title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          {/* For some reason the DialogFooter is not taking up the full width */}
          <DialogFooter className="w-full flex items-center justify-between mt-4">
            {/* Left side: Delete button */}
            {currentList?._id ? (
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="destructive"
                  data-testid="list-delete"
                  onClick={handleDeleteList}
                >
                  Delete
                </Button>
              </DialogClose>
            ) : null}

            {/* Right side: Cancel and Submit buttons */}
            <div className="flex space-x-2">
              <DialogClose asChild>
                <Button data-testid="list-cancel" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button data-testid="list-submit" type="submit">
                Submit
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
