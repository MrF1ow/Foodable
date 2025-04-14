export const KrogerApi = {
  fetchKrogerLocations: async (zipCode: string) => {
    console.log("fetchKrogerLocations starting...");
    try {
      const response = await fetch(`/api/kroger?zipCode=${zipCode}`);
      if (!response.ok) {
        throw new Error(
          `Error getting Kroger locations: ${response.statusText}`
        );
      }
      const data = await response.json();
        console.log("Kroger locations response:", data);
      return data;
    } catch (error) {
      console.error("Error getting Kroger locations: ", error);
      throw error;
    }
  },
  fetchKrogerProducts: async (term: string, locationId?: string) => {
    console.log("fetchKrogerProducts starting...");
    try {
      const url = locationId
        ? `/api/kroger?term=${term}&locationId=${locationId}`
        : `/api/kroger?term=${term}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Error getting Kroger products: ${response.statusText}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting Kroger products: ", error);
      throw error;
    }
  },
};
