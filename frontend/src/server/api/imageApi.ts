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

export const fetchImageById = async (imageId: string) => {
  try {
    const response = await axios.get(`/images?id=${imageId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting image:", error);
    throw error;
  }
};

export const deleteImageById = async (imageId: string) => {
  try {
    const response = await axios.delete(`/images?id=${imageId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};
