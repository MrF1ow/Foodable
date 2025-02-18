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
import { getIndexOfItemInArray } from "@/utils/listItems";
import {
  useCreateGroceryList,
  useDeleteGroceryList,
  useUpdateGroceryList,
  useFetchGroceryListById,
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
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);
  const removeCurrentList = useGroceryStore((state) => state.removeCurrentList);
  const fetchAndStore = useGroceryStore((state) => state.fetchFullGroceryList);
  const addList = useGroceryStore((state) => state.addList);
  const removeList = useGroceryStore((state) => state.removeList);
  const getCurrentItems = useGroceryStore((state) => state.getCurrentItems);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (metadata.title !== newTitle && metadata._id) {
      updateCurrentListItem(metadata._id.toString(), newTitle);

      // Fetch the list and update the title
      const { groceryList, isLoadingGroceryList, errorGroceryList } =
        useFetchGroceryListById({
          id: metadata._id?.toString() || "",
          enabled: !!metadata._id,
        });
      if (errorGroceryList) {
        console.error("Error fetching grocery list:", errorGroceryList);
      }
      const list = groceryList;
      const newList = { ...list, _id: list?._id, title: newTitle };
      updateGroceryList(newList as GroceryList);
    } else {
      try {
        const currentItems = getCurrentItems() || [];
        const list = await createGroceryList({
          creatorId: "000000000000000000000000", // Will need to change this
          title: newTitle,
          items: currentItems,
        });
        await fetchAndStore(list._id.toString());
        const listMetadata = {
          type: "grocery",
          _id: list._id,
          title: newTitle,
        } as GroceryMetaData;

        setCurrentList(listMetadata);
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
    removeCurrentList(metadata._id.toString());
    removeList(metadata._id.toString());
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
