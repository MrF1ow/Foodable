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
import { GroceryList, GroceryListMainInfo } from "@/types/grocery";
import { getIndexOfItemInArray } from "@/utils/listItems";
import {
  useCreateGroceryList,
  useDeleteGroceryList,
  useUpdateGroceryList,
  useFetchGroceryListById,
} from "@/server/hooks/groceryListHooks";
import { useFetchAllGroceryLists } from "@/server/hooks/groceryListHooks";

interface EditButtonProps {
  list: GroceryListMainInfo;
}

export const EditButton = ({ list: list }: EditButtonProps) => {
  const [newTitle, setNewTitle] = useState(list.title);
  const [isOpen, setIsOpen] = useState(false);
  const { updateGroceryList } = useUpdateGroceryList();
  const deleteGroceryList = useDeleteGroceryList();

  const currentGroceryListTitles = useGroceryStore(
    (state) => state.currentLists
  );

  const {
    updateCurrentListItem,
    setCurrentList,
    setItems,
    items,
    groceryLists,
    setListDeleted,
    currentList,
  } = useGroceryStore((state) => state);

  const { removeCurrentList } = useGroceryStore((state) => state);

  const indexOfTitle = getIndexOfItemInArray(
    list.title,
    currentGroceryListTitles.map((list) => list.title)
  );

  const { createGroceryList, isCreatingGroceryList, createError, createData } =
    useCreateGroceryList();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (indexOfTitle !== -1 && list.title !== "New List") {
      updateCurrentListItem(indexOfTitle, newTitle);
      groceryLists.forEach((list) => {
        if (list._id === currentList._id) {
          list.title = currentList.title;
          updateGroceryList(list);
        }
      });
    } else {
      try {
        const list = await createGroceryList({
          creatorId: "000000000000000000000000", // Will need to change this
          title: newTitle,
          items: items,
        });
        setCurrentList({ title: newTitle, _id: list._id, category: "" });
        setItems(items);
      } catch (error) {
        console.error(error);
      }
    }
    setIsOpen(false);
  };

  const handleDeleteList = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (list._id !== undefined) {
      setListDeleted(true);
      removeCurrentList(list.title);
      setItems([]);
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
