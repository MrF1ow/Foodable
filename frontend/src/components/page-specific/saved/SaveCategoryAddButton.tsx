"use client";

// Package Imports
import { IoMdAddCircle } from "react-icons/io";
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
import { useSavedItemsStore } from "@/stores/saved/store";

export default function SaveCategoryAddButton(): JSX.Element {
  const [newListTitle, setNewListTitle] = useState("");
  const currentCategories = useSavedItemsStore(
    (state) => state.currentCategories
  );
  const setCurrentCategories = useSavedItemsStore(
    (state) => state.setCurrentCategories
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newListTitle) return;
    const newCategories = [...currentCategories, newListTitle];
    setCurrentCategories(newCategories);
    setNewListTitle("");
  };

  return (
    <Dialog>
      <DialogTrigger className="absolute bottom-0 right-0 pr-4 pb-4" asChild>
        <IoMdAddCircle size={60} className="text-primary" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Custom Category</DialogTitle>
          <DialogDescription>
            Create a custom category to store your recipes or grocery lists.
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
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
