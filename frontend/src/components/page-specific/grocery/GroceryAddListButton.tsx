"use client";

import { JSX, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Icons } from "@/components/ui/icons";
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
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { useGroceryStore } from "@/stores/grocery/store";
import { useSavedItemsStore } from "@/stores/saved/store";
import {
  useAllGroceryLists,
  useCreateGroceryList,
} from "@/server/hooks/groceryListHooks";
import { useCreateSavedItem } from "@/server/hooks/savedItemsHooks";
import { GroceryList } from "@/types/grocery";
import { SavedItem } from "@/types/saved";
import { showToast } from "@/app/providers";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { capitalizeTitle } from "@/lib/utils/other";

export default function GroceryAddButton(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selectedList, setSelectedList] = useState("");

  const { user } = useUser();
  const { createGroceryList } = useCreateGroceryList();
  const { createSavedItem } = useCreateSavedItem();
  const { refetchGroceryLists } = useAllGroceryLists({
    metadata: true,
    enabled: true,
  });
  const currentCategories = useSavedItemsStore(
    (state) => state.currentCategories
  );
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      showToast(
        TOAST_SEVERITY.ERROR,
        "Error",
        "You must be logged in to create a grocery list",
        3000
      );
      return;
    }

    if (selectedList === "") {
      showToast(
        TOAST_SEVERITY.ERROR,
        "Error",
        "You must select a category to save the list",
        3000
      );
      return;
    }

    const newList: GroceryList = {
      _id: null,
      creatorId: user.id,
      title: newTitle || "New List",
      items: [],
    };

    const savedItem: SavedItem = {
      ...newList,
      type: "groceryList",
      category: selectedList,
    } as SavedItem;

    const created = await createGroceryList(newList);
    setCurrentList(created);

    await createSavedItem(savedItem);
    await refetchGroceryLists();

    showToast(
      TOAST_SEVERITY.SUCCESS,
      "List Created",
      "Grocery list created successfully",
      3000
    );
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="ml-2 text-foreground hover:scale-110"
          aria-label="Add new grocery list"
          data-testid="add-grocery-list"
        >
          <Icons.plus className="w-6 h-6" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Grocery List</DialogTitle>
          <DialogDescription>Give your new grocery list a title and category.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="name" className="sr-only">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter list title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              data-testid="new-list-title"
            />
          </div>
          <Select onValueChange={setSelectedList} value={selectedList}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {currentCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {capitalizeTitle(cat)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" data-testid="submit-new-grocery-list">
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
