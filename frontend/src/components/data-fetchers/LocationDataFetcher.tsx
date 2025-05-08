"use client";

import { useEffect, useState } from "react";

import { useFetchUserLocation } from "@/server/hooks/googleHooks";
import { useFetchZipFromCoordinates } from "@/server/hooks/googleHooks";
import { getBrowserLocation } from "@/lib/location";
import { useUserStore } from "@/stores/user/store";
import { useGeneralStore } from "@/stores/general/store";

export default function LocationDataFetcher() {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    const { refetchUserLocation } = useFetchUserLocation();
    const { refetchZipCode } = useFetchZipFromCoordinates(latitude, longitude);
    const setLocation = useUserStore((state) => state.setLocation);
    const setZipCode = useGeneralStore((state) => state.setZipCode);

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
                    if (data != undefined && data.data) {
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

    return <></>
}