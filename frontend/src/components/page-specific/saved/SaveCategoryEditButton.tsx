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
import { getIndexOfItemInArray } from "@/lib/utils/general";

interface EditButtonProps {
  category: string;
  textSize: string;
}

export default function SaveCategoryEditButton({
  category,
  textSize,
}: EditButtonProps): JSX.Element {
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

    if (indexOfCategoryInState === -1 || indexOfCategoryInDB === -1) return; // Ensure category exists before updating

    await updateCategory({ oldCategory: category, newCategory: newTitle });

    await refetchSavedItems();
    const newCategories = [...currentCategories];
    newCategories[indexOfCategoryInState] = newTitle;
    setCurrentCategories(newCategories);
    console.log("Updated Categories: ", newCategories);
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
      <DialogTrigger
        data-testid={`saved-category-edit-${newTitle}`}
        className="ml-4"
        asChild
      >
        <MdEdit
          size={textSize}
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
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex items-center space-x-2 w-full">
            <Label htmlFor="name" className="sr-only">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Desserts .."
              value={newTitle}
              data-testid="edit-saved-title"
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          {/* For some reason the DialogFooter is not taking up the full width */}
          <DialogFooter className="w-full flex flex-row items-center justify-between mt-4">
            {/* Left side: Delete button */}
            <DialogClose asChild>
              <Button
                type="button"
                variant="destructive"
                className="w-[30%] md:w-1/4 lg:w-1/5"
                data-testid="edit-saved-delete"
                onClick={handleDeleteList}
              >
                Delete
              </Button>
            </DialogClose>

            {/* Right side: Cancel and Submit buttons */}
            <DialogClose asChild>
              <Button
                data-testid="edit-saved-cancel"
                className="w-[30%] md:w-1/4 lg:w-1/5"
                variant="outline"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              data-testid="edit-saved-submit"
              className="w-[30%] md:w-1/4 lg:w-1/5"
              type="submit"
            >
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
