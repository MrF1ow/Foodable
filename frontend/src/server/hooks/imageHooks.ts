import { useQuery, useMutation } from "@tanstack/react-query";
import {
  uploadImage,
  fetchImageBySourceId,
  deleteImageBySourceId,
} from "../api/imageApi";

export const useUploadImage = () => {
  return useMutation({ mutationFn: uploadImage });
};

export const useFetchImageBySourceId = (sourceId: string) => {
  return useQuery({
    queryKey: ["image", sourceId],
    queryFn: () => fetchImageBySourceId(sourceId),
  });
};

export const useDeleteImageBySourceId = () => {
  return useMutation({ mutationFn: deleteImageBySourceId });
};
