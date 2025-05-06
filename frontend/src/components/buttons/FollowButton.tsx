'use client';

import { useSocialStore } from "@/stores/social/store";
import { FaHeart } from "react-icons/fa";
import { useFollowUser, useDeleteFollowing, useFetchAllFollowingOfUser, useFetchUserById } from "@/server/hooks/userHooks";
import { FollowMetadata } from "@/types/user";
import { useUserStore } from "@/stores/user/store";
import { useEffect, useState } from "react";
import { getIsFollowing } from "@/lib/utils/listItems";

export default function FollowButton() {
    const selectedUser = useSocialStore((state) => state.selectedUser);
    if (!selectedUser) return <></>
    const isUser = useUserStore((state) => state.isUser)

    const [isFollowing, setIsFollowing] = useState(false)

    const { followUser } = useFollowUser();
    const { deleteFollowing } = useDeleteFollowing();
    const { refetchFollowing, following } = useFetchAllFollowingOfUser({
        enabled: isUser
    })
    const { refetchUser } = useFetchUserById({
        id: selectedUser._id.toString()!,
        enabled: !!selectedUser,
    })

    const handleFollow = async () => {
        const userMetaData = {
            _id: selectedUser._id,
            imageId: selectedUser.imageId,
            username: selectedUser.username
        } as FollowMetadata;

        await followUser(userMetaData);
        const data = await refetchFollowing();
        await refetchUser();
        setIsFollowing(getIsFollowing(selectedUser, data.data));
    };

    const handleUnfollow = async () => {
        await deleteFollowing(selectedUser._id.toString());
        const data = await refetchFollowing();
        await refetchUser();
        setIsFollowing(getIsFollowing(selectedUser, data.data));
    };

    useEffect(() => {
        if (following) {
            setIsFollowing(getIsFollowing(selectedUser, following));
        }
    }, [following]);

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