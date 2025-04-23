import { NewImageData, ExistingImageData } from "@/types/images";
import fetchWithAuth from "../fetchInstance";

export const ImageApi = {
  uploadImage: async (imageInfo: NewImageData) => {
    try {
      const formData = new FormData();

      // append the necessary info to the form data for api request
      formData.append("image", imageInfo.image);
      formData.append("sourceId", imageInfo.sourceId);
      formData.append("collectionName", imageInfo.collectionName)

      const response = await fetchWithAuth("/user/images", {
        method: "POST",
        body: formData,
      });
      return response;
    } catch (error) {
      console.log("Error uploading image:", error);
      throw error;
    }
  },
  fetchImageById: async (imageId: string) => {
    try {
      const response = await fetchWithAuth(`/images?id=${imageId}`);
      return response;
    } catch (error) {
      console.error("Error getting image:", error);
      throw error;
    }
  },
  deleteImageById: async (imageInfo: ExistingImageData) => {
    try {
      const response = await fetchWithAuth(`/user/images`, {
        method: "DELETE",
        body: JSON.stringify({imageInfo}),
      });
      return response;
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  },
};
