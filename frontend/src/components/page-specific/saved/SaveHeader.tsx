"use client";

import GeneralHeader from "@/components/GeneralHeader";
import { Button } from "@/components/ui/button";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGeneralStore } from "@/stores/general/store";
import { useSavedItemsStore } from "@/stores/saved/store";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";

export default function SaveHeader() {
  const isMobile = useGeneralStore((state) => state.isMobile);
  const [open, setOpen] = useState<boolean>(false);
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
    <div className="flex flex-row items-center justify-between gap-x-2">
      <GeneralHeader title={"Saved"} />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {isMobile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="mr-2 p-6 px-4 flex items-center justify-center bg-card-background rounded-md hover:scale-105 hover:shadow-lg transition-all"
                  data-testid="mobile-vertical-button"
                >
                  <MoreVertical className="!h-6 !w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setOpen(true)}
                  data-testid="dropdown-add-category"
                >
                  Add Category
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <IoMdAddCircle
              size={40}
              className="text-primary"
              onClick={() => setOpen(true)}
              data-testid="add-category-button"
            />
          )}
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
                data-testid="new-category-title"
              />
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button data-testid="new-category-cancel" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button data-testid="new-category-submit" type="submit">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
