'use client'

import {
    useAllSavedItems,
} from "@/server/hooks/savedItemsHooks";
import { useUserStore } from "@/stores/user/store";
import { useFetchAllFollowersOfUser, useFetchAllFollowingOfUser } from "@/server/hooks/userHooks";

export default function SocialDataFetcher() {
    const isUser = useUserStore((state) => state.isUser);
    if (!isUser) {
        return null;
    }

    const { refetchSavedItems } = useAllSavedItems({
        enabled: isUser,
    });

    const { refetchFollowing } = useFetchAllFollowingOfUser({
        enabled: isUser,
    })

    const { refetchFollowers } = useFetchAllFollowersOfUser({
        enabled: isUser
    })

    // Refetch every render
    refetchSavedItems();
    refetchFollowing();
    refetchFollowers();

    return null;
}