import { useQuery, useMutation } from "@tanstack/react-query";
import { ImageApi } from "@/server/api/imageApi";
import { IMAGES } from "@/lib/constants/process";
import { useQueryProps } from "@/types";

export const useUploadImage = () => {
  return useMutation({ mutationFn: ImageApi.uploadImage });
};

export const useFetchImageById = (
  id: string,
  { enabled = true }: useQueryProps) => {
  const {
    data: image,
    isLoading: isLoadingImage,
    refetch: refetchImage,
    error: errorImage,
    isError: isErrorImage,
  } = useQuery({
    queryKey: [IMAGES, id],
    queryFn: () => ImageApi.fetchImageById(id),
    retry: 2,
    enabled,
  });
  return { image, refetchImage, isLoadingImage, errorImage, isErrorImage };
};

export const useDeleteImageById = () => {
  return useMutation({ mutationFn: ImageApi.deleteImageById });
};
