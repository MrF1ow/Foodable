import { NewUser, User } from "@/types/user";
import fetchWithAuth from "../fetchInstance";

export const UserApi = {
  fetchUserById: async (id: string) => {
    try {
      const response = await fetchWithAuth(`/user?id=${id}`);
      return response;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  },
  createUser: async (user: NewUser) => {
    try {
      const response = await fetchWithAuth("/user", {
        method: "POST",
        body: JSON.stringify(user),
      });
      return response;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
  updateUser: async (user: User) => {
    try {
      const response = await fetchWithAuth("/user", {
        method: "PUT",
        body: JSON.stringify(user),
      });
      return response;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },
  deleteUser: async (id: string) => {
    try {
      const response = await fetchWithAuth("/user", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      return response;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};
