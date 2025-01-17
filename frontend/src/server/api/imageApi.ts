import axios from "../axiosInstance";

export const uploadImage = async (image: File) => {
  try {
    const formData = new FormData();
    formData.append("image", image);
    const response = await axios.post("/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error uploading image:", error);
    throw error;
  }
};

export const fetchImageBySourceId = async (sourceId: string) => {
  try {
    const response = await axios.get(`/images?id=${sourceId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting image:", error);
    throw error;
  }
};

export const deleteImageBySourceId = async (sourceId: string) => {
  try {
    const response = await axios.delete(`/images?id=${sourceId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};
