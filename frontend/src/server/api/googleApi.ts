export const GoogleApi = {
  fetchUserLocationFromZip: async (zipCode: string) => {
    console.log("fetchLocationFromZip starting...");
    try {
      const response = await fetch(`/google?zipCode=${zipCode}`);
      if (!response.ok) {
        throw new Error(
          `Error getting location from zip: ${response.statusText}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting location from zip: ", error);
      throw error;
    }
  },
  fetchUserLocation: async () => {
    console.log("fetchUserLocation starting...");
    try {
      const response = await fetch(`/google`);
      if (!response.ok) {
        throw new Error(`Error getting user location: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting user location: ", error);
      throw error;
    }
  },
};
