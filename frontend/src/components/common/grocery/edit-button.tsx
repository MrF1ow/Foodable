"use client";

// Package Imports
import { MdEdit } from "react-icons/md";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

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
import { useSavedItemsStore } from "@/stores/saved/store";
import {
  useAllGroceryLists,
  useCreateGroceryList,
  useDeleteGroceryList,
  useUpdateGroceryList,
} from "@/server/hooks/groceryListHooks";
import { GroceryList } from "@/types/grocery";
import { showToast } from "@/providers/react-query-provider";
import { TOAST_SEVERITY } from "@/lib/constants/ui";

export const EditButton = () => {
  const currentList = useGroceryStore((state) => state.currentList);
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);

  const [newTitle, setNewTitle] = useState(currentList?.title || "");
  const [isOpen, setIsOpen] = useState(false);

  const { refetchGroceryLists } = useAllGroceryLists({
    metadata: true,
    enabled: true,
  });
  const { updateGroceryList } = useUpdateGroceryList();
  const { createGroceryList } = useCreateGroceryList();
  const { deleteGroceryList } = useDeleteGroceryList();

  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentGroceryList = currentList;

    if (!currentGroceryList) return;

    const newList = {
      ...currentGroceryList,
      title: newTitle,
    };

    if (currentList.title !== newTitle) {
      if (currentList._id) {
        await updateGroceryList(newList as GroceryList);
        showToast(
          TOAST_SEVERITY.SUCCESS,
          "List Updated",
          "Grocery list updated successfully",
          3000
        );
        setCurrentList(newList);
      } else {
        if (!user) {
          showToast(
            TOAST_SEVERITY.ERROR,
            "Error",
            "You must be logged in to create a grocery list",
            3000
          );
          return;
        }
        const newCreateList = {
          ...newList,
          creatorId: user.id,
        };

        const createData = await createGroceryList(
          newCreateList as GroceryList
        );
        setCurrentList(createData);

        showToast(
          TOAST_SEVERITY.SUCCESS,
          "List Created",
          "Grocery list created successfully",
          3000
        );
      }
      setIsOpen(false);
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

        // After deletion, force refetch of the grocery lists
        await refetchGroceryLists();

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
              placeholder="Enter list title..."
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
