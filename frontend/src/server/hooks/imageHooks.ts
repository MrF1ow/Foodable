import { useQuery, useMutation } from "@tanstack/react-query";
import { ImageApi } from "@/server/api/imageApi";
import { IMAGES } from "@/lib/constants/process";
import { useQueryProps } from "@/types";
import { NewImageData, ExistingImageData } from "@/types/images";


export const useFetchImageById = (
  id: string | null,
  { enabled = true }: useQueryProps) => {
  const shouldFetch = !!id && enabled;

  const {
    data: image,
    isLoading: isLoadingImage,
    refetch: refetchImage,
    error: errorImage,
    isError: isErrorImage,
  } = useQuery({
    queryKey: [IMAGES, id],
    queryFn: () => {
      if (!id) throw new Error("Image ID is null or undefined");
      return ImageApi.fetchImageById(id);
    },
    retry: 2,
    enabled: shouldFetch,
  });
  return { image, refetchImage, isLoadingImage, errorImage, isErrorImage };
};

export const useDeleteImage = () => {
  const mutation = useMutation<ExistingImageData, Error, ExistingImageData, unknown>({
    mutationFn: (imageInfo: ExistingImageData) => ImageApi.deleteImageById(imageInfo)
  })

  return {
    deleteImage: mutation.mutate,
    isDeleteingImage: mutation.isPending,
    deleteImageError: mutation.error
  }
};

export const useUploadImage = () => {
  const mutation = useMutation<NewImageData, Error, NewImageData, unknown>({
    mutationFn: (imageInfo: NewImageData) => ImageApi.uploadImage(imageInfo)
  })

  return {
    uploadImage: mutation.mutate,
    isUploadingImage: mutation.isPending,
    uploadImageError: mutation.error
  }
};