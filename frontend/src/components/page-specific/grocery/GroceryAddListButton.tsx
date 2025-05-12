"use client";

import { JSX, useState } from "react";
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
import { FaPlus } from "react-icons/fa";

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
import { capitalizeTitle } from "@/lib/utils/general";
import { useUpdateUserCurrentList } from "@/server/hooks/userHooks";
import { useGeneralStore } from "@/stores/general/store";

export default function GroceryAddButton(): JSX.Element {
  const isMobile = useGeneralStore((state) => state.isMobile);

  const setCurrentList = useGroceryStore((state) => state.setCurrentList);

  const currentCategories = useSavedItemsStore(
    (state) => state.currentCategories
  );

  const [selectedList, setSelectedList] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { updateUserCurrentList } = useUpdateUserCurrentList();
  const { refetchGroceryLists } = useAllGroceryLists({
    metadata: true,
    enabled: true,
  });
  const { createGroceryList } = useCreateGroceryList();
  const { createSavedItem } = useCreateSavedItem();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedList !== "") {
      const newList = {
        _id: null,
        creatorId: null,
        title: newTitle || "New List",
        items: [],
        category: selectedList,
      };

      const createData = await createGroceryList(newList as GroceryList);

      if (!createData) {
        showToast(
          TOAST_SEVERITY.ERROR,
          "Error",
          "Failed to create grocery list",
          3000
        );
        return;
      }

      const newSaveItem = {
        _id: createData._id,
        title: createData.title,
        type: "groceryList",
        category: selectedList,
      }

      const savedItem = await createSavedItem(newSaveItem as SavedItem);
      if (!savedItem) {
        showToast(
          TOAST_SEVERITY.ERROR,
          "Error",
          "Failed to save grocery list",
          3000
        );
        return;
      }

      await updateUserCurrentList(createData._id);
      setCurrentList(createData);


      await refetchGroceryLists();
      setIsOpen(false);
    } else {
      showToast(
        TOAST_SEVERITY.ERROR,
        "Error",
        "You must select a category to save the list",
        3000
      );
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <FaPlus className="text-foreground hover:scale-105" data-testid="add-grocery-list" aria-label="Add new grocery list" />
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
