'use client';

import { isValidObjectId } from "@/lib/validation/types/general";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import { useFetchImageById } from "@/server/hooks/imageHooks";
import { useSocialStore } from "@/stores/social/store";
import SocialSectionLayout from "@/layouts/page-specific/social/SocialSectionLayout";
import SocialItem from "./SocialSectionSectionItems";
import { MdClose } from "react-icons/md";
import FollowButton from "@/components/buttons/FollowButton";

interface UserPopupHeaderProps {
    handleClose: () => void;
}
export const UserPopupHeader = ({ handleClose }: UserPopupHeaderProps) => {
    const currentUser = useSocialStore((state) => state.selectedUser);

    const isValidBannerId = !!currentUser?.imageId && isValidObjectId(currentUser.imageId);

    const {
        image,
        isLoadingImage,
    } = useFetchImageById(currentUser?.imageId ? currentUser.imageId.toString() : null, {
        enabled: isValidBannerId,
    });

    return (
        <Card className="relative w-full h-full rounded-md overflow-hidden">
            <CardContent>
                {isLoadingImage && (
                    <Spinner />
                )}
                {image && image.base64Image && (
                    <Image
                        src={image.base64Image}
                        alt="User Banner"
                        fill
                        className="object-cover"
                    />
                )}
                {!image && !image?.base64Image && (
                    <div className="w-full h-full bg-gray-200" />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white bg-black bg-opacity-50">
                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="flex flex-row items-center gap-4">
                            <h1 className="text-2xl md:text-4xl lg:text-6xl font-semibold">
                                {currentUser?.username || "Foodie"}
                            </h1>
                        </div>
                        <FollowButton />
                    </div>
                </div>

                <div className="absolute top-0 right-0">
                    <MdClose className="text-4xl bg-transparent mix-blend-difference text-white" onClick={handleClose} />
                </div>
            </CardContent>
        </Card>
    );
}

export const UserPopupFollowerSectionHeader = ({ title }: { title: string }) => {
    return (
        <div className="h-full w-full flex items-center justify-center bg-primary text-background rounded-md">
            <h3 className="text-xl text-center">{title}</h3>
        </div>
    )
}

interface UserPopupSectionProps {
    handleItemClick: (id: string) => void;
}

export const UserPopupFollowerSection = ({ handleItemClick }: UserPopupSectionProps) => {
    const currentUser = useSocialStore((state) => state.selectedUser);
    return (
        <SocialSectionLayout headerComponent={<UserPopupFollowerSectionHeader title="Their Followers" />}>
            <div className="w-full h-full">
                {currentUser?.followers.length === 0 && (
                    <div className="text-center text-lg text-foreground italic">
                        Be Their First Friend
                    </div>
                )}
                {currentUser?.followers.map((follow) => (
                    <SocialItem
                        key={follow._id.toString()}
                        title={follow.username}
                        handleClick={() => handleItemClick(follow._id.toString())}
                    />
                ))}
            </div>
        </SocialSectionLayout>
    );
}

export const UserPopupRecipeSection = ({ handleItemClick }: UserPopupSectionProps) => {
    const currentUser = useSocialStore((state) => state.selectedUser);

    return (
        <SocialSectionLayout headerComponent={<UserPopupFollowerSectionHeader title="Their Recipes" />}>
            <div className="w-full h-full">
                {currentUser?.savedItems.recipes.length === 0 && (
                    <div className="text-center text-lg text-foreground italic">
                        No Saved Recipes
                    </div>
                )}
                {currentUser?.savedItems.recipes.map((recipe) => (
                    <SocialItem
                        key={recipe._id.toString()}
                        title={recipe.title}
                        imageId={recipe.imageId ? recipe.imageId.toString() : null}
                        handleClick={() =>
                            handleItemClick(recipe._id.toString())
                        }
                    />
                ))}
            </div>
        </SocialSectionLayout>
    );
}