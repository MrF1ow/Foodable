import { useQuery, useMutation } from "@tanstack/react-query";
import { uploadImage, fetchImageById, deleteImageById } from "../api/imageApi";

export const useUploadImage = () => {
  return useMutation({ mutationFn: uploadImage });
};

export const useFetchImageById = (imageId: string) => {
  return useQuery({
    queryKey: ["image", imageId],
    queryFn: () => fetchImageById(imageId),
  });
};

export const useDeleteImageById = () => {
  return useMutation({ mutationFn: deleteImageById });
};
