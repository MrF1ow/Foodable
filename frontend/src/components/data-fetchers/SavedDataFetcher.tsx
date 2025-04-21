"use client";

import {
    useAllSavedItems,
    useGetCategories,
} from "@/server/hooks/savedItemsHooks";
import { useSavedItemsStore } from "@/stores/saved/store";
import { useEffect } from "react";
import { useUserStore } from "@/stores/user/store";

export default function SavedDataFetcher() {
    const isUser = useUserStore((state) => state.isUser);
    if (!isUser) {
        return null;
    }
    const currentCategories = useSavedItemsStore(
        (state) => state.currentCategories
    );
    const setCurrentCategories = useSavedItemsStore(
        (state) => state.setCurrentCategories
    );

    const { savedItems } = useAllSavedItems({
        enabled: isUser,
    });
    const { categories } = useGetCategories({ enabled: isUser });
    useEffect(() => {
        if (savedItems) {
            let combinedCategories: string[] = [];

            if (categories) {

                if (categories.length !== 0) {
                    combinedCategories = [...currentCategories, ...categories];
                } else if (currentCategories.length !== 0) {
                    combinedCategories = currentCategories;
                } else {
                    combinedCategories = [];
                }
                setCurrentCategories(combinedCategories);
            }
        }
    }, [savedItems, categories]);
    return <></>;
}
