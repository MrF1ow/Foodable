import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageApi } from "@/server/api/imageApi";
import { IMAGES } from "@/lib/constants/process";
import { useQueryProps } from "@/types";
import { NewImageData, ExistingImageData, UploadImageResponse, DeleteImageReponse } from "@/types/images";


// export const useFetchImageById = (
//   id: string | null,
//   { enabled = true }: useQueryProps) => {
//   const shouldFetch = !!id && enabled;

//   const {
//     data: image,
//     isLoading: isLoadingImage,
//     refetch: refetchImage,
//     error: errorImage,
//     isError: isErrorImage,
//   } = useQuery({
//     queryKey: [IMAGES, id],
//     queryFn: () => {
//       if (!id) throw new Error("Image ID is null or undefined");
//       return ImageApi.fetchImageById(id);
//     },
//     retry: 2,
//     enabled: shouldFetch,
//   });
//   return { image, refetchImage, isLoadingImage, errorImage, isErrorImage };
// };

export const useFetchImageById = (
  id: string | null,
  { enabled = true }: useQueryProps
) => {
  const shouldFetch = !!id && enabled;

  const {
    data: image,
    refetch: refetchImage,
    isLoading: isLoadingImage,
    error: errorImage,
    isError: isErrorImage,
  } = useQuery({
    queryKey: [IMAGES, id],
    queryFn: () => {
      if (!id) throw new Error("Image ID is null or undefined");
      console.log("id for refetch hook", id);
      return ImageApi.fetchImageById(id);
    },
    retry: 2,
    enabled: shouldFetch,
  });

  return {
    image,
    isLoadingImage,
    errorImage,
    isErrorImage,
    refetchImage,
  };
};

export const useDeleteImage = () => {
  const mutation = useMutation<DeleteImageReponse, Error, ExistingImageData, unknown>({
    mutationFn: (imageInfo: ExistingImageData) => ImageApi.deleteImageById(imageInfo)
  })

  return {
    deleteImage: mutation.mutateAsync,
    isDeleteingImage: mutation.isPending,
    deleteImageError: mutation.error
  }
};

export const useUploadImage = () => {
  const mutation = useMutation<UploadImageResponse, Error, NewImageData, unknown>({
    mutationFn: (imageInfo: NewImageData) => ImageApi.uploadImage(imageInfo)
  })

  return {
    uploadImage: mutation.mutateAsync,
    isUploadingImage: mutation.isPending,
    uploadImageError: mutation.error
  }
};