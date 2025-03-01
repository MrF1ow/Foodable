import fetchWithAuth from "../fetchInstance";

export const ImageApi = {
  uploadImage: async (image: File) => {
    try {
      const formData = new FormData();
      formData.append("image", image);
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
  deleteImageById: async (imageId: string) => {
    try {
      const response = await fetchWithAuth(`/user/images?id=${imageId}`, {
        method: "DELETE",
      });
      return response;
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  },
};
