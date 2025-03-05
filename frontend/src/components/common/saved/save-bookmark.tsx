"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import { useSavedItemsStore } from "@/stores/saved/store";
import { useRecipeStore } from "@/stores/recipe/store";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SavedItem, UnsavedItem } from "@/types/saved";
import { capitalizeTitle } from "@/utils/other";
import { GroceryList } from "@/types/grocery";
import { Recipe } from "@/types/recipe";

interface SaveBookmarkProps {
  data: Recipe | GroceryList | SavedItem | UnsavedItem;
  setOpen?: (arg0: boolean) => void;
}

export const SaveBookmark = ({ data, setOpen }: SaveBookmarkProps) => {
  const categories = useSavedItemsStore((state) => state.currentCategories);

  const setCurrentCategories = useSavedItemsStore(
    (state) => state.setCurrentCategories
  );

  const [newListTitle, setNewListTitle] = useState("");
  const [selectedList, setSelectedList] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newListTitle.trim()) {
      setSelectedList(newListTitle.trim());
      setNewListTitle("");
    }

    // this is now a saved item
    const toInsert = {
      ...data,
      category: selectedList,
    };

    if (selectedList) {
    }
  };

  const handleRemoveSave = () => {
    if (setOpen) {
      setOpen(false);
    }
  };

  if ("category" in data) {
    return (
      <div className="absolute bottom-0 right-0 pr-4 pb-4">
        <IoBookmark
          size={50}
          className="text-primary"
          onClick={handleRemoveSave}
        />
      </div>
    );
  }

  if (!("category" in data)) {
    return (
      <Dialog>
        <DialogTrigger className="absolute bottom-0 right-0 pr-4 pb-4" asChild>
          <IoBookmarkOutline size={60} className="text-primary" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save to a Category</DialogTitle>
            <DialogDescription>
              Select an existing category or create a new one to organize your
              items.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Select onValueChange={setSelectedList} value={selectedList}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((list) => (
                    <SelectItem key={list} value={list}>
                      {capitalizeTitle(list)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Label htmlFor="name" className="sr-only">
                  New Category Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Create new category..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                />
                <Button type="submit">Add</Button>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={() => console.log("Saving to:", selectedList)}
                disabled={!selectedList}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
};
