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
import {
  GroceryMetaData,
  RecipeMetaData,
  SavedRecipeMetaData,
} from "@/types/saved";
import { capitalizeTitle } from "@/utils/other";

interface SaveBookmarkProps {
  data: RecipeMetaData | GroceryMetaData | SavedRecipeMetaData | any;
  setOpen?: (arg0: boolean) => void;
}

export const SaveBookmark = ({ data, setOpen }: SaveBookmarkProps) => {
  const lists = useSavedItemsStore((state) => state.sortedSavedItems);
  const addSavedList = useSavedItemsStore((state) => state.addSavedCategory);
  const replaceRecipe = useRecipeStore((state) => state.replaceRecipe);
  const addSavedItem = useSavedItemsStore((state) => state.addSavedItem);
  const removeSavedItem = useSavedItemsStore((state) => state.removeSavedItem);
  const [newListTitle, setNewListTitle] = useState("");
  const [selectedList, setSelectedList] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newListTitle.trim()) {
      addSavedList(newListTitle.trim());
      setSelectedList(newListTitle.trim());
      setNewListTitle("");
    }

    // this is now a saved recipe
    const toInsert = {
      ...data,
      category: selectedList,
    };

    if (selectedList) {
      addSavedItem(toInsert);
      replaceRecipe(toInsert);
    }
  };

  const handleRemoveSave = () => {
    console.log("Removing save from category:", data.category);
    removeSavedItem(data);
    if (data.type === "recipe") {
      // this is now an unsaved recipe
      const toInsert = {
        ...data,
        category: null,
      };

      replaceRecipe(toInsert);
      if (setOpen) {
        setOpen(false);
      }
    }
  };

  if (data.category) {
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

  if (!data.category) {
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
                  {lists.map((list) => (
                    <SelectItem key={list.title} value={list.title}>
                      {capitalizeTitle(list.title)}
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
