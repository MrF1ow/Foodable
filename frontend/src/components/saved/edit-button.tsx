"use client";

// Package Imports
import { MdEdit } from "react-icons/md";
import { useState } from "react";

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
import { useSavedItemsStore } from "@/stores/saved/store";
import { getIndexOfItemInArray } from "@/utils/listItems";

interface EditButtonProps {
  category: string;
}

export const EditButton = ({ category }: EditButtonProps) => {
  const [newTitle, setNewTitle] = useState(category);

  const currentSavedCategories = useSavedItemsStore(
    (state) => state.sortedSavedItems
  );

  const updateSavedCategory = useSavedItemsStore(
    (state) => state.updateSavedCategory
  );
  const deleteSavedCategory = useSavedItemsStore(
    (state) => state.removeSavedCategory
  );

  const indexOfCategory = getIndexOfItemInArray(
    category,
    currentSavedCategories.map((cat) => cat.title)
  );


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (indexOfCategory === -1) return; // Ensure category exists before updating

    updateSavedCategory(category, newTitle);
  };

  const handleDeleteList = (event: React.MouseEvent) => {
    event.stopPropagation();
    deleteSavedCategory(category);
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
