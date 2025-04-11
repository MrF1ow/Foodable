"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

import { useGroceryStore } from "@/stores/grocery/store";
import { useGeneralStore } from "@/stores/general/store";
import { useUpdateGroceryList } from "@/server/hooks/groceryListHooks";

import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { showToast } from "@/app/providers";
import { MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GroceryEditButton from "@/components/page-specific/grocery/GroceryEditButton";
import { useUpdateUserCurrentList } from "@/server/hooks/userHooks";
import { GroceryListIdentifier } from "@/types/grocery";
import { FORM_NAMES } from "@/lib/constants/forms";
import { MdClose } from "react-icons/md";

import type { GroceryList } from "@/types/grocery";
import { JSX } from "react";

export const MainGroceryHeader = (): JSX.Element => {
    const isMobile = useGeneralStore((state) => state.isMobile);

    const setSplitLayout = useGeneralStore((state) => state.setSplitLayout);
    const setCurrentForm = useGeneralStore((state) => state.setCurrentForm);
    const setShowPortal = useGeneralStore((state) => state.setShowPortal);
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
        if ("_id" in groceryList && groceryList._id) {
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
        <GroceryHeaderWithChildren
            width={isMobile ? "40%" : "60%"}

        >
            <div className="flex flex-row items-center">
                <Button
                    onClick={handleItemDeletion}
                    className="mr-2 p-6 px-4 flex items-center justify-center bg-destructive rounded-md hover:scale-105 hover:shadow-lg transition-all"
                    data-testid="remove-items-button"
                >
                    <Icons.delete className="!h-6 !w-6" />
                </Button>
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
                                onClick={() => {
                                    setCurrentForm(FORM_NAMES.ADD_ITEM_TO_LIST);
                                    setShowPortal(true);
                                    setSplitLayout(true);
                                }}
                                data-testid="dropdown-add-item"
                            >
                                Add Item
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setCurrentForm(FORM_NAMES.FIND_PRICE);
                                    setShowPortal(true);
                                    setSplitLayout(true);
                                }}
                                data-testid="dropdown-find-price"
                            >
                                Find Price
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setCurrentForm(FORM_NAMES.LIST_ASSISTANT);
                                    setShowPortal(true);
                                    setSplitLayout(true);
                                }}
                                data-testid="dropdown-grocery-helper"
                            >
                                AI Helper
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button
                        onClick={() => {
                            setCurrentForm(FORM_NAMES.FIND_PRICE)
                            setShowPortal(true);
                            setSplitLayout(true);
                        }
                        }
                        className="text-2xl p-6 bg-primary font-bold rounded-md hover:scale-105 hover:shadow-lg transition-all"
                        data-testid="find-price-button"
                    >
                        {"Find Price"}
                    </Button>
                )}
            </div>
        </GroceryHeaderWithChildren>
    );
}

export const GroceryHeaderWithChildren = ({
    width,
    children,
}: GroceryHeaderProps & {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full flex justify-between items-center">
            <GroceryHeader width={width} />
            <div>{children}</div>
        </div>
    );
};

export interface GroceryHeaderProps {
    width: string;
}

export const GroceryHeader = ({ width }: GroceryHeaderProps) => {
    const currentList = useGroceryStore((state) => state.currentList);
    const availableLists = useGroceryStore((state) => state.availableLists);
    const currentForm = useGeneralStore((state) => state.currentForm);
    const setShowPortal = useGeneralStore((state) => state.setShowPortal);
    const setCurrentForm = useGeneralStore((state) => state.setCurrentForm);
    const setCurrentList = useGroceryStore((state) => state.setCurrentList);
    const setOpenAccordion = useGroceryStore((state) => state.setOpenSections);
    const isMobile = useGeneralStore((state) => state.isMobile);

    const { updateUserCurrentList } = useUpdateUserCurrentList();

    if (!currentList) return null;

    const handleListChange = async (item: GroceryListIdentifier) => {
        await updateUserCurrentList(item.id);
        const newList = {
            ...currentList,
            items: [],
            _id: item.id,
            title: item.title,
        };
        setCurrentList(newList);
        setOpenAccordion([]);
    };

    const handleCloseSideList = () => {
        setCurrentForm(null);
        setShowPortal(false);
    }

    const filteredLists = currentList._id
        ? availableLists.filter(
            (list: GroceryListIdentifier) =>
                list.id !== currentList._id || currentList._id === null
        )
        : availableLists;

    console.log("Filtered Lists", filteredLists);

    console.log("Title", currentList.title);

    return (
        <div className="flex flex-row justify-between items-center" style={{ width: width }}>
            <div
                className={`inline-flex items-center bg-primary font-bold rounded-[0%_0%_75%_0%] rounded-l-lg rounded-tr-lg px-4 py-2 h-full`}
                style={{ width: width }}
            >
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div
                            className={`text-foreground ${isMobile ? "text-xl" : "text-4xl"}  whitespace-nowrap cursor-pointer outline-none`}
                            data-testid="grocery-header"
                        >
                            {currentList.title || "New List"}
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {filteredLists.length > 0 ? (
                            filteredLists.map((list: GroceryListIdentifier) => (
                                <DropdownMenuItem
                                    key={list.id}
                                    onClick={() => handleListChange(list)}
                                >
                                    {list.title}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem disabled>No lists available</DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <span>
                    <GroceryEditButton />
                </span>
            </div>
            {currentForm === FORM_NAMES.GROCERY_LIST && (
                <MdClose onClick={handleCloseSideList} size={40} />
            )}
        </div>
    );
};


export interface GroceryHeaderProps {
    width: string;
}

export const GroceryHeaderMin = ({ width }: GroceryHeaderProps) => {
    const currentList = useGroceryStore((state) => state.currentList);

    if (!currentList) return null;

    return (
        <div
            className={`inline-flex items-center bg-primary font-bold rounded-[0%_0%_75%_0%] rounded-l-lg rounded-tr-lg px-4 py-2 h-full`}
            style={{ width: width }}
        >
            <div
                className="text-foreground text-4xl cursor-pointer outline-none bg-transparent"
                data-testid="grocery-header"
            >
                {currentList.title || "New List"}
            </div>
        </div>
    );
};

