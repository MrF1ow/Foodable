import { useQuery, useMutation } from "@tanstack/react-query";
import { ImageApi } from "../api/imageApi";

export const useUploadImage = () => {
  return useMutation({ mutationFn: ImageApi.uploadImage });
};

export const useFetchImageById = (imageId: string) => {
  return useQuery({
    queryKey: ["image", imageId],
    queryFn: () => ImageApi.fetchImageById(imageId),
  });
};

export const useDeleteImageById = () => {
  return useMutation({ mutationFn: ImageApi.deleteImageById });
};
