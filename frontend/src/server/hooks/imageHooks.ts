import { useQuery, useMutation } from "@tanstack/react-query";
import { ImageApi } from "@/server/api/imageApi";
import { IMAGES } from "@/lib/constants/process";

export const useUploadImage = () => {
  return useMutation({ mutationFn: ImageApi.uploadImage });
};

export const useFetchImageById = (imageId: string) => {
  return useQuery({
    queryKey: [IMAGES, imageId],
    queryFn: () => ImageApi.fetchImageById(imageId),
  });
};

export const useDeleteImageById = () => {
  return useMutation({ mutationFn: ImageApi.deleteImageById });
};
