"use client";

// Package Imports
import { MdEdit } from "react-icons/md";
import { JSX, useState } from "react";

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
  useAllSavedItems,
  useDeleteCategory,
  useUpdateCategory,
  useGetCategories,
} from "@/server/hooks/savedItemsHooks";
import { useSavedItemsStore } from "@/stores/saved/store";
import { getIndexOfItemInArray } from "@/lib/utils/other";

interface EditButtonProps {
  category: string;
}

export default function SaveCategoryEditButton({ category }: EditButtonProps): JSX.Element {
  const [newTitle, setNewTitle] = useState(category);

  const currentCategories = useSavedItemsStore(
    (state) => state.currentCategories
  );
  const setCurrentCategories = useSavedItemsStore(
    (state) => state.setCurrentCategories
  );

  const { categories } = useGetCategories({ enabled: true });
  const { refetchSavedItems } = useAllSavedItems({ enabled: true });
  const { deleteCategory } = useDeleteCategory();
  const { updateCategory } = useUpdateCategory();

  if (!currentCategories) return <></>; // Ensure currentCategories is defined

  const indexOfCategoryInState = getIndexOfItemInArray(
    category,
    currentCategories
  );

  const indexOfCategoryInDB = getIndexOfItemInArray(category, categories);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (indexOfCategoryInState === -1) return; // Ensure category exists before updating

    if (indexOfCategoryInDB !== -1) {
      const newCategories = [...currentCategories];
      newCategories[indexOfCategoryInState] = newTitle;
      setCurrentCategories(newCategories);
    }

    if (indexOfCategoryInDB !== -1) {
      await updateCategory({ oldCategory: category, newCategory: newTitle });

      await refetchSavedItems();
    }
  };

  const handleDeleteList = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (indexOfCategoryInState !== -1) {
      const newCategories = currentCategories.filter(
        (item) => item !== category
      );
      setCurrentCategories(newCategories);
    }

    if (indexOfCategoryInDB !== -1) {
      deleteCategory(category);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="ml-4" asChild>
        <MdEdit
          size={40}
          className="text-foreground"
          onClick={(event) => event.stopPropagation()}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Custom Category</DialogTitle>
          <DialogDescription>
            Edit your custom category to store your recipes or grocery lists.
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
              placeholder="Desserts .."
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
                onClick={handleDeleteList}
              >
                Delete
              </Button>
            </DialogClose>

            {/* Right side: Cancel and Submit buttons */}
            <div className="flex space-x-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Submit</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
