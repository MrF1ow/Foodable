'use client'

import { showToast } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { useUpdateGroceryList } from "@/server/hooks/groceryListHooks";
import { useGroceryStore } from "@/stores/grocery/store";
import { useUserStore } from "@/stores/user/store";
import { GroceryList } from "@/types/grocery";
import { MdDelete } from "react-icons/md";

export default function GroceryDeleteButton() {
    const isUser = useUserStore((state) => state.isUser);
    const setCurrentList = useGroceryStore((state) => state.setCurrentList);
    const currentList = useGroceryStore((state) => state.currentList);

    const { updateGroceryList } = useUpdateGroceryList();

    const handleItemDeletion = () => {
        const groceryList = currentList;
        const groceryItems = groceryList?.items;
        if (!groceryItems) return;

        const uncheckedItems = groceryItems.filter((item) => !item.checked);
        groceryList.items = uncheckedItems;
        const newList = { ...groceryList, items: uncheckedItems } as GroceryList;
        setCurrentList(newList);

        // only make the API call if the list is saved and has an id in the database
        if ("_id" in groceryList && groceryList._id && isUser) {
            updateGroceryList(groceryList);
        }
        showToast(
            TOAST_SEVERITY.SUCCESS,
            "Deleted",
            `Checked Items have been Removed`,
            3000
        );
    };

    return (
        <Button
            onClick={handleItemDeletion}
            variant="outline"
            className="h-12 w-12 flex items-center justify-center bg-transparent border-destructive rounded-md hover:scale-105 hover:shadow-lg hover:bg-destructive/25 transition-all"
            data-testid="remove-items-button"
        >
            <MdDelete className="!w-6 !h-6" />
        </Button>
    )

}