import { User } from "@/types";
import axios from "../axiosInstance";

export const fetchUserById = async (id: string) => {
  try {
    const response = await axios.get(`/users?id=${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
};

export const createUser = async (user: User) => {
  try {
    const response = await axios.post("/users", user);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (user: User) => {
  try {
    const response = await axios.put("/users", user);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await axios.delete("/users", { data: { id } });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
