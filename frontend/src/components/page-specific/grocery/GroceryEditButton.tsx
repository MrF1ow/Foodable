"use client";

// Package Imports
import { MdEdit } from "react-icons/md";
import { JSX, useEffect, useState } from "react";

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
import { useSavedItemsStore } from "@/stores/saved/store";
import {
  useAllGroceryLists,
  useCreateGroceryList,
  useDeleteGroceryList,
  useUpdateGroceryList,
} from "@/server/hooks/groceryListHooks";
import { GroceryList } from "@/types/grocery";
import { showToast } from "@/app/providers";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeTitle } from "@/lib/utils/general";
import {
  useAllSavedItems,
  useCreateSavedItem,
  useUpdateSavedItem,
} from "@/server/hooks/savedItemsHooks";
import { SavedItem } from "@/types/saved";
import { useRemoveAllGroceryListFromAllUsers } from "@/server/hooks/bulkOperationHooks";
import { useFetchUserCurrentList } from "@/server/hooks/userHooks";

export default function GroceryEditButton({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}): JSX.Element {
  const currentList = useGroceryStore((state) => state.currentList);
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);

  const currentCategories = useSavedItemsStore(
    (state) => state.currentCategories
  );

  const [selectedList, setSelectedList] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (currentList) {
      console.log();
      setNewTitle(currentList?.title);
    }
  }, [isOpen]);

  const { refetchGroceryLists } = useAllGroceryLists({
    metadata: true,
    enabled: true,
  });
  const { refetchCurrentListId } = useFetchUserCurrentList({
    enabled: true,
  });
  const { refetchSavedItems } = useAllSavedItems({ enabled: true });
  const { updateGroceryList } = useUpdateGroceryList();
  const { createGroceryList } = useCreateGroceryList();
  const { deleteGroceryList } = useDeleteGroceryList();
  const { updateSavedItem } = useUpdateSavedItem();
  const { createSavedItem } = useCreateSavedItem();
  const { removeAllGroceryListFromAllUsers } =
    useRemoveAllGroceryListFromAllUsers();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentGroceryList = currentList;

    if (!currentGroceryList) return;

    const newList = {
      ...currentGroceryList,
      title: newTitle,
    };

    if (selectedList !== "") {
      if (currentList._id) {
        if (currentList.title !== newTitle) {
          await updateGroceryList(newList as GroceryList);

          showToast(
            TOAST_SEVERITY.SUCCESS,
            "List Updated",
            "Grocery list updated successfully",
            3000
          );

          setCurrentList(newList);
        }

        const savedItem = {
          ...newList,
          type: "groceryList",
          category: selectedList,
        } as SavedItem;

        await updateSavedItem(savedItem);

        showToast(
          TOAST_SEVERITY.SUCCESS,
          "Saved",
          "Grocery list saved successfully",
          3000
        );
      } else {
        const newSavedList = {
          ...newList,
          type: "groceryList",
          category: selectedList,
        };

        const createData = await createGroceryList(newList as GroceryList);
        setCurrentList(createData);

        await createSavedItem(newSavedList as SavedItem);

        showToast(
          TOAST_SEVERITY.SUCCESS,
          "List Created",
          "Grocery list created successfully",
          3000
        );
      }
      await refetchGroceryLists();
      await refetchSavedItems();
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

  const handleDeleteList = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!currentList) return;

    console.log("Delete List Id:", currentList._id);

    deleteGroceryList(currentList._id.toString(), {
      onSuccess: async () => {
        showToast(
          TOAST_SEVERITY.INFO,
          "Deleting List",
          "Deleting grocery list...",
          3000
        );

        console.log("List id before bulk deletion", currentList._id.toString());

        await removeAllGroceryListFromAllUsers(currentList._id.toString());
        // After deletion, force refetch of the grocery lists
        await refetchCurrentListId();
        await refetchGroceryLists();
        await refetchSavedItems();

        showToast(
          TOAST_SEVERITY.SUCCESS,
          "List Deleted",
          "Grocery list deleted successfully",
          3000
        );

        const newList = {
          _id: null,
          creatorId: null,
          title: "New List",
          items: [],
        };
        setCurrentList(newList); // Clear the current list
        setIsOpen(false); // Close the dialog
      },
      onError: (error) => {
        showToast(
          TOAST_SEVERITY.ERROR,
          "Error",
          error.message || "Error deleting list",
          3000
        );
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 w-full px-2 py-1.5 hover:bg-accent rounded-sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          data-testid="edit-grocery-list"
        >
          <MdEdit className="text-foreground" />
          {children}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Grocery List Title</DialogTitle>
          <DialogDescription>
            Make changes to your grocery list title. Click submit when
            you`&apos;`re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="name" className="sr-only">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter list title..."
                data-testid="list-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <Select onValueChange={setSelectedList} value={selectedList}>
              <SelectTrigger data-testid="select-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {currentCategories.map((list) => (
                  <SelectItem key={list} value={list}>
                    {capitalizeTitle(list)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="w-full flex items-center justify-between mt-4">
            {/* Left side: Delete button */}
            {currentList?._id ? (
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
            ) : null}

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
}
