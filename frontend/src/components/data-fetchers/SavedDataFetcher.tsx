"use client";

import {
    useAllSavedItems,
    useGetCategories,
} from "@/server/hooks/savedItemsHooks";
import { useSavedItemsStore } from "@/stores/saved/store";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export default function SavedDataFetcher() {
    const { isSignedIn } = useAuth();
    if (!isSignedIn) {
        return null;
    }
    const currentCategories = useSavedItemsStore(
        (state) => state.currentCategories
    );
    const setCurrentCategories = useSavedItemsStore(
        (state) => state.setCurrentCategories
    );

    const { savedItems } = useAllSavedItems({
        enabled: true,
    });
    const { categories } = useGetCategories({ enabled: true });
    useEffect(() => {
        if (savedItems) {
            let combinedCategories: string[] = [];

            if (categories.length !== 0) {
                combinedCategories = [...currentCategories, ...categories];
            } else if (currentCategories.length !== 0) {
                combinedCategories = currentCategories;
            } else {
                combinedCategories = [];
            }
            setCurrentCategories(combinedCategories);
        }
    }, [savedItems, categories]);
    return <></>;
}
