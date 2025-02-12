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
import { IoBookmarkOutline } from "react-icons/io5";
import { useSavedItemsStore } from "@/stores/saved/store";
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

interface GeneralSaveProps {
  data: RecipeMetaData | GroceryMetaData;
}

export const GeneralSave = ({ data }: GeneralSaveProps) => {
  const lists = useSavedItemsStore((state) => state.sortedSavedItems); // Now using sortedSavedItems
  const addSavedList = useSavedItemsStore((state) => state.addSavedCategory);
  const addSavedItem = useSavedItemsStore((state) => state.addSavedItem);
  const [newListTitle, setNewListTitle] = useState("");
  const [selectedList, setSelectedList] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newListTitle.trim()) {
      addSavedList(newListTitle.trim());
      setSelectedList(newListTitle.trim());
      setNewListTitle("");
    }

    console.log("Data:", data);

    const toInsert = {
      ...data,
      category: selectedList,
    };
    console.log(toInsert);
    console.log(selectedList);
    console.log(lists);

    if (selectedList) {
      addSavedItem(toInsert);
    }
  };

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
};
