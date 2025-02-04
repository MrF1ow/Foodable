import { User } from "@/types/user";
import axios from "../axiosInstance";

export const UserApi = {
  fetchUserById: async (id: string) => {
    try {
      const response = await axios.get(`/user?id=${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  },
  createUser: async (user: User) => {
    try {
      const response = await axios.post("/user", user);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
  updateUser: async (user: User) => {
    try {
      const response = await axios.put("/user", user);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
  deleteUser: async (id: string) => {
    try {
      const response = await axios.delete("/user", { data: { id } });
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};
