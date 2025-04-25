'use client'

import { isValidObjectId } from "@/lib/utils/typeValidation/general";
import { useFetchImageById } from "@/server/hooks/imageHooks";
import { useAllSavedItems } from "@/server/hooks/savedItemsHooks";
import { useFetchSelf, useFetchUserBannerId } from "@/server/hooks/userHooks";
import { useUserStore } from "@/stores/user/store";
import { useEffect } from "react";

export default function SocialDataFetcher() {
    const isUser = useUserStore((state) => state.isUser);
    const currentBannerId = useUserStore((state) => state.bannerId);
    const setBannerId = useUserStore((state) => state.setBannerId);

    if (!isUser) {
        return null;
    }

    const { userProfile } = useFetchSelf({ enabled: true });
    const { bannerId, refetchBannerId } = useFetchUserBannerId({
        enabled: !!userProfile?._id,
    });

    const { savedItems } = useAllSavedItems({
        enabled: isUser,
    });

    const isValidBannerId = !!currentBannerId && isValidObjectId(currentBannerId);

    const {
        refetchImage
    } = useFetchImageById(currentBannerId, {
        enabled: isValidBannerId,
    });

    useEffect(() => {
        if (bannerId && isValidObjectId(bannerId)) {
            setBannerId(bannerId);
        }
    }, [bannerId]);

    useEffect(() => {

        refetchImage();
        refetchBannerId();

    }, [currentBannerId])

    return <></>;
}