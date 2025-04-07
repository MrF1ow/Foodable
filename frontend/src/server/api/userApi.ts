import { NewUser, User, UserPreferences, UserSettings } from "@/types/user";
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

  fetchAllFollowingOfUser: async () => {
    try {
      const response = await fetchWithAuth("/user/users/following");
      return response;
    } catch (error) {
      console.error("Error getting following:", error);
      throw error;
    }
  },

  fetchAllFollowersOfUser: async () => {
    try {
      const response = await fetchWithAuth("/user/users/followers");
      return response;
    } catch (error) {
      console.error("Error getting followers:", error);
      throw error;
    }
  },

  removeFollowing: async (followingId: string) => {
    try {
      const response = await fetchWithAuth("/user/users/following", {
        method: "DELETE",
        body: JSON.stringify({ followingId }),
      });
      return response;
    } catch (error) {
      console.error("Error removing follower:", error);
      throw error;
    }
  },

  fetchUserSettings: async () => {
    try {
      const response = await fetchWithAuth("/user/settings");
      return response;
    } catch (error) {
      console.error("Error getting user settings:", error);
      throw error;
    }
  },

  updateUserSettings: async (settings: UserSettings) => {
    try {
      const response = await fetchWithAuth("/user/settings", {
        method: "PUT",
        body: JSON.stringify({ settings }),
      });
      return response;
    } catch (error) {
      console.error("Error updating user settings:", error);
      throw error;
    }
  },

  fetchUserPreferences: async () => {
    try {
      const response = await fetchWithAuth("/user/preferences");
      return response;
    } catch (error) {
      console.error("Error getting user preferences:", error);
      throw error;
    }
  },

  updateUserPreferences: async (preferences: UserPreferences) => {
    try {
      const response = await fetchWithAuth("/user/preferences", {
        method: "PUT",
        body: JSON.stringify({ preferences }),
      });
      return response;
    } catch (error) {
      console.error("Error updating user preferences:", error);
      throw error;
    }
  },

  fetchUserCurrentList: async () => {
    try {
      const response = await fetchWithAuth("/user/grocery/current");
      return response;
    } catch (error) {
      console.error("Error getting current list:", error);
      throw error;
    }
  },

  updateUserCurrentList: async (id: string) => {
    console.log("Updating current list with ID:", id);
    try {
      const response = await fetchWithAuth("/user/grocery/current", {
        method: "POST",
        body: JSON.stringify({ _id: id }),
      });
      return response;
    } catch (error) {
      console.error("Error updating current list:", error);
      throw error;
    }
  },
};
