"use client";

// Package Imports
import { MdEdit } from "react-icons/md";
import { useEffect, useState } from "react";

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
  useCreateGroceryList,
  useDeleteGroceryList,
  useUpdateGroceryList,
} from "@/server/hooks/groceryListHooks";
import { GroceryMetaData, SavedGroceryMetaData } from "@/types/saved";
import { GroceryList } from "@/types/grocery";

export const EditButton = () => {
  const getCurrentMetadata = useGroceryStore(
    (state) => state.getCurrentMetadata
  );
  const [metadata, setMetadata] = useState<
    GroceryMetaData | SavedGroceryMetaData
  >(getCurrentMetadata() as GroceryMetaData | SavedGroceryMetaData);

  const [newTitle, setNewTitle] = useState(metadata.title);
  const [isOpen, setIsOpen] = useState(false);

  const { updateGroceryList } = useUpdateGroceryList();
  const { createGroceryList } = useCreateGroceryList();
  const { deleteGroceryList } = useDeleteGroceryList();

  const updateCurrentListItem = useGroceryStore(
    (state) => state.updateCurrentListItem
  );

  const fetchAndStore = useGroceryStore((state) => state.fetchFullGroceryList);
  const addList = useGroceryStore((state) => state.addList);
  const removeList = useGroceryStore((state) => state.removeList);
  const getCurrentList = useGroceryStore((state) => state.getCurrentData);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentList = getCurrentList();
    console.log("Current List", currentList);
    if (!currentList) return;

    if (metadata.title !== newTitle && metadata._id) {
      console.log("Updating List");
      updateCurrentListItem(metadata._id.toString(), newTitle);
      const newList = {
        ...currentList,
        title: newTitle,
      };
      console.log("New", newList);
      updateGroceryList(newList as GroceryList);
    } else {
      console.log("Creating List");
      try {
        const currentItems = currentList?.items;
        const response = await createGroceryList({
          creatorId: "000000000000000000000000", // Will need to change this
          title: newTitle,
          items: currentItems || [],
        });
        await fetchAndStore(response._id.toString());
        const listMetadata = {
          type: "grocery",
          _id: response._id,
          title: newTitle,
        } as GroceryMetaData;
        addList(listMetadata);
      } catch (error) {
        console.error("Error creating grocery list:", error);
      }
    }

    setIsOpen(false);
  };

  const handleDeleteList = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!metadata._id) return;
    removeList(metadata._id.toString());
    deleteGroceryList(metadata._id.toString());
    setIsOpen(false);
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
            {metadata._id ? (
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
