'use client'
    ;
import { useEffect } from "react";
import { useGroceryStore } from "@/stores/grocery/store";
import { useUserStore } from "@/stores/user/store";
import { getBrowserLocation } from "@/lib/utils/getBrowserLocation";
import { useFetchUserLocation } from "@/server/hooks/googleHooks";
import { NewGroceryList } from "@/types/grocery";

export default function GuestDataMonitor() {
    const isUser = useUserStore((state) => state.isUser);
    const currentList = useGroceryStore((state) => state.currentList);
    const setCurrentList = useGroceryStore((state) => state.setCurrentList);
    const setLocation = useUserStore((state) => state.setLocation);

    const { refetchUserLocation } = useFetchUserLocation();

    useEffect(() => {
        async function fetchUserLocation() {
            const browserLocation = await getBrowserLocation();
            if (browserLocation) {
                setLocation(browserLocation);
                console.log("User Location From Browser:", browserLocation);
            } else {
                const result = await refetchUserLocation();
                const location = result.data;
                if (location) {
                    setLocation(location);
                    console.log("User Location From Google:", location);
                }
            }
        }
        fetchUserLocation();
    }, []);

    useEffect(() => {
        if (currentList) return;
        console.log("No current list found, creating a new one");
        const newList: NewGroceryList = {
            _id: null,
            creatorId: null,
            title: "New List",
            items: [],
        };
        setCurrentList(newList);
    }, [isUser]);

    return null;
}