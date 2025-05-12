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
import { createToMutate } from "@/lib/items/utils";
import { useSavedItemsStore } from "@/stores/saved/store";
import { JSX, useState } from "react";
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
import { capitalizeTitle } from "@/lib/utils/general";
import { GroceryList } from "@/types/grocery";
import { Recipe } from "@/types/recipe";
import {
    useCreateSavedItem,
    useDeleteSavedItem,
    useAllSavedItems,
} from "@/server/hooks/savedItemsHooks";

interface SaveBookmarkProps {
    isSaved: boolean;
    data: Recipe | GroceryList | SavedItem | UnsavedItem;
    handleRemove: () => Promise<void>;
}

export default function SaveBookmark({ isSaved, data, handleRemove }: SaveBookmarkProps): JSX.Element {
    const categories = useSavedItemsStore((state) => state.currentCategories);

    const setCurrentCategories = useSavedItemsStore(
        (state) => state.setCurrentCategories
    );

    const { refetchSavedItems } = useAllSavedItems({ enabled: true });
    const { createSavedItem } = useCreateSavedItem();

    const [newListTitle, setNewListTitle] = useState("");
    const [selectedList, setSelectedList] = useState("");

    const handleAddCategory = () => {
        const category = newListTitle.trim();
        setNewListTitle("");
        setCurrentCategories([...categories, category]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const toInsert = createToMutate(data, selectedList);

        await createSavedItem(toInsert);
        await refetchSavedItems();
    };

    const handleRemoveSave = async () => {
        await handleRemove();
    };

    if (isSaved) {
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

    if (!isSaved) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    <IoBookmarkOutline size={50} className="text-primary" />
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
                                <Button type="button" onClick={handleAddCategory}>
                                    Add
                                </Button>
                            </div>
                        </div>
                        <DialogFooter className="mt-4">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={!selectedList}>
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

    return <></>;
};
