"use client";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

import { useGroceryStore } from "@/stores/grocery/store";
import { useGeneralStore } from "@/stores/general/store";
import { useUpdateGroceryList } from "@/server/hooks/groceryListHooks";
import VerticalOptionsButton from "@/components/buttons/VerticalOptionsButton";

import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { showToast } from "@/app/providers";
import { MoreVertical, Router } from "lucide-react";
import { FaEllipsisV } from "react-icons/fa";
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
import { useUserStore } from "@/stores/user/store";
import GroceryAddButton from "./GroceryAddListButton";

import GroceryDeleteButton from "./GroceryDeleteButton";

export const MainGroceryHeader = (): JSX.Element => {
    const isUser = useUserStore((state) => state.isUser);
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
        <GroceryHeaderWithChildren>
            <div className="flex flex-row items-center h-full w-full">
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
                            <DropdownMenuItem
                                className="text-red"
                                onClick={handleItemDeletion}
                                data-testid="dropdown-remove-items-button"
                            >
                                Clear Selected
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex flex-row items-center pt-6 pb-6 h-full gap-2">
                        <GroceryDeleteButton />
                        <Button
                            onClick={() => {
                                setCurrentForm(FORM_NAMES.FIND_PRICE);
                                setShowPortal(true);
                                setSplitLayout(true);
                            }}
                            className="h-12 px-4 bg-primary rounded-md hover:scale-105 hover:shadow-lg transition-all text-base"
                            data-testid="find-price-button"
                        >
                            Find Price
                        </Button>
                    </div>
                )}
            </div>
        </GroceryHeaderWithChildren>
    );
}

export const GroceryHeaderWithChildren = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="h-full flex justify-between items-center gap-2">
            <GroceryHeader />
            <div>{children}</div>
        </div>
    );
};

export interface GroceryHeaderProps {
    additionalBackClick?: () => void;
}


export const GroceryHeader = ({ additionalBackClick }: GroceryHeaderProps) => {
    const isUser = useUserStore((state) => state.isUser);
    const currentList = useGroceryStore((state) => state.currentList);
    const availableLists = useGroceryStore((state) => state.availableLists);
    const currentForm = useGeneralStore((state) => state.currentForm);
    const setShowPortal = useGeneralStore((state) => state.setShowPortal);
    const setCurrentForm = useGeneralStore((state) => state.setCurrentForm);
    const setCurrentList = useGroceryStore((state) => state.setCurrentList);
    const setOpenAccordion = useGroceryStore((state) => state.setOpenSections);

    const { updateUserCurrentList } = useUpdateUserCurrentList();

    if (!currentList) return null;

    const handleListChange = async (item: GroceryListIdentifier) => {
        if (isUser) {
            await updateUserCurrentList(item.id);
        }
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
        additionalBackClick?.();
        setCurrentForm(null);
        setShowPortal(false);
    }

    const filteredLists = currentList._id
        ? availableLists.filter(
            (list: GroceryListIdentifier) =>
                list.id !== currentList._id || currentList._id === null
        )
        : availableLists;
    return (
        <div className="flex flex-row justify-between items-center w-full">
            <div
                className="inline-flex items-center justify-between md:justify-start bg-primary font-bold md:rounded-[0%_0%_75%_0%] md:rounded-l-lg md:rounded-tr-lg rounded-lg px-4 py-2 h-full w-full lg:w-[40%] text-2xl md:text-3xl lg:text-4xl"
            >
                {isUser ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div
                                className={`text-foreground whitespace-nowrap cursor-pointer outline-none`}
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
                ) : (
                    <div
                        className={`text-foreground whitespace-nowrap cursor-pointer outline-none`}
                        data-testid="grocery-header"
                    >
                        {currentList.title || "New List"}
                    </div>
                )}

                {isUser && (
                    <div className="flex flex-row lg:ml-4 gap-2 items-center justify-center">
                        <GroceryEditButton />
                        <GroceryAddButton />
                    </div>
                )}
            </div>
            {currentForm === FORM_NAMES.GROCERY_LIST && (
                <MdClose onClick={handleCloseSideList} size={40} />
            )}
        </div>
    );
};

export const GroceryHeaderMin = ({ additionalBackClick }: GroceryHeaderProps) => {
    const currentList = useGroceryStore((state) => state.currentList);
    const currentForm = useGeneralStore((state) => state.currentForm);
    const setCurrentForm = useGeneralStore((state) => state.setCurrentForm);
    const setShowPortal = useGeneralStore((state) => state.setShowPortal);

    const handleCloseSideList = () => {
        additionalBackClick?.();
        setCurrentForm(null);
        setShowPortal(false);
    }

    if (!currentList) return null;

    return (
        <div className="flex flex-row justify-between items-center w-full">
            <div
                className={`inline-flex items-center justify-between md:justify-start bg-primary font-bold md:rounded-[0%_0%_75%_0%] md:rounded-l-lg md:rounded-tr-lg rounded-lg px-4 py-2 h-full w-full lg:w-[40%] text-2xl md:text-3xl lg:text-4xl`}
            >
                <div
                    className="text-foreground text-4xl cursor-pointer outline-none bg-transparent"
                    data-testid="grocery-header"
                >
                    {currentList.title || "New List"}
                </div>
            </div>
            {currentForm === FORM_NAMES.GROCERY_LIST && (
                <MdClose onClick={handleCloseSideList} size={40} />
            )}
        </div>
    );
};

