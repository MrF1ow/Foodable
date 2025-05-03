'use client';

import { useSocialStore } from "@/stores/social/store";
import { FaHeart } from "react-icons/fa";
import { useFollowUser, useDeleteFollowing, useFetchAllFollowingOfUser } from "@/server/hooks/userHooks";
import { FollowMetadata } from "@/types/user";
import { useUserStore } from "@/stores/user/store";
import { useEffect, useState } from "react";
import { getIsFollowing } from "@/lib/utils/listItems";

export default function FollowButton() {
    const selectedUser = useSocialStore((state) => state.selectedUser);
    if (!selectedUser) return <></>
    const isUser = useUserStore((state) => state.isUser)

    const [isFollowing, setIsFollowing] = useState(false)
    const [remount, callRemount] = useState(false);

    const { followUser } = useFollowUser();
    const { deleteFollowing } = useDeleteFollowing();
    const { refetchFollowing, following } = useFetchAllFollowingOfUser({
        enabled: isUser
    })

    useEffect(() => {
        console.log('Following:', following);
        const isFollowing = getIsFollowing(selectedUser, following);
        setIsFollowing(isFollowing)
        callRemount(false);
    }, [remount])

    const handleFollow = async () => {
        const userMetaData = {
            _id: selectedUser._id,
            imageId: selectedUser.imageId,
            username: selectedUser.username
        } as FollowMetadata

        followUser(userMetaData);

        await refetchFollowing();

        callRemount(true)
    }

    const handleUnfollow = async () => {
        deleteFollowing(selectedUser._id.toString());

        await refetchFollowing();

        callRemount(true);
    }

    return (
        <div className="absolute bottom-0 right-0 pr-4 pb-4">
            <FaHeart
                size={50}
                className={isFollowing ? "text-primary" : ""}
                onClick={isFollowing ? handleUnfollow : handleFollow}
            />
        </div>
    );
}