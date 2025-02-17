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
import { GroceryMetaData, UnsavedGroceryMetaData } from "@/types/saved";
import { GroceryList } from "@/types/grocery";

interface EditButtonProps {
  metadata: GroceryMetaData | UnsavedGroceryMetaData;
}

export const EditButton = ({ metadata }: EditButtonProps) => {
  const [newTitle, setNewTitle] = useState(metadata.title);
  const [isOpen, setIsOpen] = useState(false);

  const { updateGroceryList } = useUpdateGroceryList();
  const deleteGroceryList = useDeleteGroceryList();
  const { updateCurrentListItem, setCurrentList, removeCurrentList } =
    useGroceryStore((state) => ({
      updateCurrentListItem: state.updateCurrentListItem,
      setCurrentList: state.setCurrentList,
      removeCurrentList: state.removeCurrentList,
    }));

  const currentGroceryListTitles = useGroceryStore((state) =>
    state.currentLists.map((list) => list.title)
  );

  const indexOfTitle = getIndexOfItemInArray(
    metadata.title,
    currentGroceryListTitles
  );

  const { createGroceryList } = useCreateGroceryList();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (indexOfTitle !== -1 && "_id" in metadata) {
      if (!metadata._id) return;
      updateCurrentListItem(metadata._id.toString(), newTitle);
      const {
        data: response,
        isLoading,
        error,
      } = useFetchGroceryListById(metadata._id.toString());
      if (error) {
        console.error("Error fetching grocery list:", error);
      }
      const list = response;
      const newList = { ...list, title: newTitle };
      updateGroceryList(newList as GroceryList);
    } else {
      try {
        const list = await createGroceryList({
          creatorId: "000000000000000000000000", // Will need to change this
          title: newTitle,
          items: [],
        });
        const listMetadata = {
          type: "grocery",
          _id: list._id,
          title: list.title,
        } as GroceryMetaData;

        setCurrentList(listMetadata);
      } catch (error) {
        console.error("Error creating grocery list:", error);
      }
    }

    setIsOpen(false);
  };

  const handleDeleteList = (event: React.MouseEvent) => {
    event.stopPropagation();
    if ("_id" in metadata && metadata._id) {
      removeCurrentList(metadata._id.toString());
      setIsOpen(false);
    }
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
