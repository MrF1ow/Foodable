"use client";

import { useEffect, useState } from "react";

// Local Imports
import { useGroceryStore } from "@/stores/grocery/store";
import { TOAST_SEVERITY } from "@/lib/constants/ui";
import { showToast } from "@/app/providers";
import type { NewGroceryList } from "@/types/grocery";
import { useAllGroceryLists } from "@/server/hooks/groceryListHooks";
import { useFetchGroceryListById } from "@/server/hooks/groceryListHooks";
import {
    useFetchUserCurrentList
} from "@/server/hooks/userHooks";
import { useFetchUserLocation } from "@/server/hooks/googleHooks";
import { useFetchZipFromCoordinates } from "@/server/hooks/googleHooks";
import { getBrowserLocation } from "@/lib/utils/getBrowserLocation";
import { isValidObjectId } from "@/lib/utils/typeValidation/general";
import { getAvailableGroceryLists } from "@/lib/utils/listItems";
import { useUserStore } from "@/stores/user/store";
import { useGeneralStore } from "@/stores/general/store";

export default function GroceryListDataFetcher() {

    const isUser = useUserStore((state) => state.isUser);
    if (!isUser) {
        return null;
    }

    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)

    const setCurrentList = useGroceryStore((state) => state.setCurrentList);
    const setAvailableLists = useGroceryStore((state) => state.setAvailableLists);
    const currentList = useGroceryStore((state) => state.currentList);
    const { refetchUserLocation } = useFetchUserLocation();
    const { refetchZipCode } = useFetchZipFromCoordinates(latitude, longitude);
    const setLocation = useUserStore((state) => state.setLocation);
    const setZipCode = useGeneralStore((state) => state.setZipCode);

    // fetch the currentList that the user is currently on
    // this will be used to fetch the grocery list by id
    const {
        currentGroceryListId,
        isLoadingCurrentListId,
        refetchCurrentListId,
        isErrorCurrentListId,
    } = useFetchUserCurrentList({
        enabled: true,
    });

    // use tanstack to fetch all grocery lists in metadata mode
    // this will only fetch the metadata of the grocery lists
    const {
        groceryLists,
        isErrorGroceryLists,
        isLoadingGroceryLists,
        errorGroceryLists,
    } = useAllGroceryLists({
        metadata: true,
        enabled: true,
    });

    // fetch the grocery list by id that is stored in the currentList state of the user data
    const { refetchGroceryList } = useFetchGroceryListById({
        id: currentGroceryListId,
        enabled: !!currentGroceryListId && isValidObjectId(currentGroceryListId) && currentGroceryListId !== currentList?._id,
    });

    async function refetchUserCurrentListId(): Promise<{ data?: string | null }> {
        return await refetchCurrentListId();
    }

    // get the user location from the browser
    useEffect(() => {
        async function fetchUserLocation() {
            const browserLocation = await getBrowserLocation();

            const location = browserLocation || (await refetchUserLocation()).data;
            if (location) {
                setLocation(location);
                console.log("User Location:", location);

                const { latitude, longitude } = location;
                setLatitude(latitude);
                setLongitude(longitude);
                try {
                    const data = await refetchZipCode();
                    if (data != undefined) {
                        const { zipCode } = data.data;
                        console.log("User Zip Code:", zipCode);
                        if (zipCode) {
                            setZipCode(zipCode);
                        }
                    }
                } catch (err) {
                    console.error("Failed to get zip from coordinates", err);
                }
            } 
        }
        fetchUserLocation();
    }, []);

    // handle the grocery lists metadata and set the available lists
    useEffect(() => {
        if (isErrorGroceryLists) {
            showToast(
                TOAST_SEVERITY.ERROR,
                "Error",
                errorGroceryLists?.message || "Error Fetching Grocery Lists",
                3000
            );
        }

        if (isLoadingGroceryLists) {
            showToast(TOAST_SEVERITY.INFO, "Loading", "Fetching Grocery Lists", 3000);
        }

        const availableLists = getAvailableGroceryLists(groceryLists);
        console.log("Available Lists", availableLists);
        setAvailableLists(availableLists);
    }, [currentList]);

    // handle the current grocery list and set the current list
    useEffect(() => {
        if (isLoadingCurrentListId) {
            showToast(
                TOAST_SEVERITY.INFO,
                "Loading",
                "Fetching Current Grocery List",
                3000
            );
        }

        if (isErrorCurrentListId) {
            showToast(
                TOAST_SEVERITY.ERROR,
                "Error",
                "Error Fetching Current Grocery List",
                3000
            );
        }
        // if the current grocery list is not null, refetch the grocery list
        // if the current grocery list is null, create a new grocery list
        if (currentGroceryListId && isValidObjectId(currentGroceryListId)) {
            // if the grocery list is not null, set the current list to the grocery list
            refetchGroceryList().then((result) => {
                if (result?.data) {
                    setCurrentList(result.data);
                }
            });
        } else if (currentGroceryListId && !isValidObjectId(currentGroceryListId)) {
            showToast(TOAST_SEVERITY.ERROR, "Error", "Invalid Grocery List ID", 3000);
            const newList: NewGroceryList = {
                _id: null,
                creatorId: null,
                title: "New List",
                items: [],
            };
            setCurrentList(newList);
        } else {
            const newList: NewGroceryList = {
                _id: null,
                creatorId: null,
                title: "New List",
                items: [],
            };
            setCurrentList(newList);
        }
    }, [currentGroceryListId]);

    // refetch the grocery list when the current list changes
    useEffect(() => {
        if (currentList?._id) {
            if (isValidObjectId(currentList._id)) {
                refetchUserCurrentListId()
            }
        }
    }, [currentList]);

    return <></>;
}
