import { NewUser, User } from "@/types/user";
import fetchWithAuth from "../fetchInstance";
import { remove } from "node_modules/cypress/types/lodash";

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

  fetchAllFollowingOfUser: async () => {
    try {
      const response = await fetchWithAuth("/user/following");
      return response;
    } catch (error){
      console.error("Error getting following:", error);
      throw error;
    }
  },

  fetchAllFollowersOfUser: async () => {
    try {
      const response = await fetchWithAuth("/user/followers");
      return response;
    } catch (error) {
      console.error("Error getting followers:", error);
      throw error;
    }
  },

  removeFollower: async (followerId: string) => {
    try {
      const response = await fetchWithAuth("/user/followers", {
        method: "DELETE",
        body: JSON.stringify({ followerId }),
      });
      return response;
    } catch (error) {
      console.error("Error removing follower:", error);
      throw error;
    }
  },
};
