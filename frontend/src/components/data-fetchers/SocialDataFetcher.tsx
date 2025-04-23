'use client'

import { isValidObjectId } from "@/lib/utils/typeValidation/general";
import { useFetchImageById, useUploadImage } from "@/server/hooks/imageHooks";
import { useFetchSelf, useFetchUserBannerId } from "@/server/hooks/userHooks";
import { NewImageData } from "@/types/images";
import { useUserStore } from "@/stores/user/store";
import { useEffect } from "react";

export default function SocialDataFetch() {
    const isUser = useUserStore((state) => state.isUser);
    const currentBannerId = useUserStore((state) => state.bannerId);
    const setBannerId = useUserStore((state) => state.setBannerId);

    if (!isUser) {
        return null;
    }

    const { userProfile, isLoadingSelf } = useFetchSelf({ enabled: true });
    const { uploadImage } = useUploadImage();
    const { bannerId, refetchBannerId } = useFetchUserBannerId({
        enabled: !!userProfile?._id,
    });

    useEffect(() => {

    }, [])

    return <></>;
}