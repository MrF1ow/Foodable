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
import { useAllSavedItems, useCreateSavedItem, useUpdateSavedItem } from "@/server/hooks/savedItemsHooks";
import { SavedItem } from "@/types/saved";
import { useRemoveAllGroceryListFromAllUsers } from "@/server/hooks/bulkOperationHooks";
import { useFetchUserCurrentList } from "@/server/hooks/userHooks";

export default function GroceryEditButton(): JSX.Element {
  const currentList = useGroceryStore((state) => state.currentList);
  const setCurrentList = useGroceryStore((state) => state.setCurrentList);

  const currentCategories = useSavedItemsStore(
    (state) => state.currentCategories
  );

  const [selectedList, setSelectedList] = useState("");
  const [newTitle, setNewTitle] = useState(currentList?.title || "");
  const [isOpen, setIsOpen] = useState(false);

  const { refetchGroceryLists } = useAllGroceryLists({
    metadata: true,
    enabled: true,
  });
  const { refetchCurrentListId } = useFetchUserCurrentList({
    enabled: true,
  });
  const { refetchSavedItems } = useAllSavedItems({ enabled: true })
  const { updateGroceryList } = useUpdateGroceryList();
  const { createGroceryList } = useCreateGroceryList();
  const { deleteGroceryList } = useDeleteGroceryList();
  const { updateSavedItem } = useUpdateSavedItem();
  const { createSavedItem } = useCreateSavedItem();
  const { removeAllGroceryListFromAllUsers } = useRemoveAllGroceryListFromAllUsers();

  const isFormValid = newTitle.trim() !== "" && selectedList.trim() !== "";


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

        const createData = await createGroceryList(
          newList as GroceryList
        );
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

        await removeAllGroceryListFromAllUsers(currentList._id.toString())
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
      <DialogTrigger className="ml-4" asChild>
        <MdEdit
          className="text-foreground hover:scale-105"
          aria-label="Add Current List"
          data-testid="list-edit"
          onClick={(event) => {
            event.stopPropagation();
            setIsOpen(true);
          }}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Grocery List Title</DialogTitle>
          <DialogDescription>
            Make changes to your grocery list title. Click submit when
            you`&apos;`re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Enter new item title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
          data-testid="title-input"
        />
      </div>

      <div>
        <Select onValueChange={setSelectedList} value={selectedList}>
          <SelectTrigger>
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
        {!selectedList && (
          <p className="text-red-500 text-sm mt-1">Please select a category.</p>
        )}
      </div>

      <Button type="submit" data-testid="list-submit" disabled={!isFormValid}>
        Submit
      </Button>
    </form>
      </DialogContent>
    </Dialog>
  );
}
