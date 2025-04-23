import { isValidObjectId } from "@/lib/utils/typeValidation/general";
import { useFetchImageById, useUploadImage } from "@/server/hooks/imageHooks";
import { useFetchSelf, useFetchUserBannerId } from "@/server/hooks/userHooks";
import { NewImageData } from "@/types/images";

export const useUserBannerImageFlow = () => {
    const { userProfile, isLoadingSelf } = useFetchSelf({ enabled: true });
    const { uploadImage } = useUploadImage();
    const { bannerId, refetchBannerId } = useFetchUserBannerId({
        enabled: !!userProfile?._id,
    });

    const isValidBannerId = !!bannerId && isValidObjectId(bannerId);

    const {
        image,
        refetchImage,
        isLoadingImage,
    } = useFetchImageById(bannerId, {
        enabled: isValidBannerId,
    });

    const handleImageEditSubmit = async (imageFile: File) => {
        if (!userProfile?._id) return;

        const newImage: NewImageData = {
            image: imageFile,
            sourceId: userProfile._id,
            collectionName: "users",
        };

        await uploadImage(newImage).then((response) => {
            if (response){
                
            }
        });
        await Promise.all([refetchBannerId(), refetchImage()]);
    };

    return {
        userProfile,
        bannerImage: image,
        isLoadingBannerImage: isLoadingImage,
        handleImageEditSubmit,
        isLoadingSelf,
    };
};
