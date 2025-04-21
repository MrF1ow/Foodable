'use client'

import SearchBar from "@/components/SearchBar";
import { useSavedItemsStore } from "@/stores/saved/store";

export default function SaveItemSearchBar() {
    const setSearchQuery = useSavedItemsStore((state) => state.setSearchQuery);
    const currentSearchQuery = useSavedItemsStore((state) => state.searchQuery);

    return (
        <div className="flex justify-between gap-2">
            <SearchBar
                searchQuery={currentSearchQuery}
                setSearchQuery={setSearchQuery}
            />
        </div>
    );
}