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
      //   console.log("Kroger locations response:", data);
      return data;
    } catch (error) {
      console.error("Error getting Kroger locations: ", error);
      throw error;
    }
  },
  fetchKrogerProducts: async (term: string, locationId?: string) => {
    console.log("fetchKrogerProducts starting...");
    console.log("LOCATION ID:", locationId);
    try {
      const url = locationId
        ? `/api/kroger?term=${encodeURIComponent(
            term
          )}&filter.locationId=${locationId}`
        : `/api/kroger?term=${encodeURIComponent(term)}`;
      console.log("URL:", url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Error getting Kroger products: ${response.statusText}`
        );
      }
      const data = await response.json();
      console.log("Kroger product response T:", data);
      return data;
    } catch (error) {
      console.error("Error getting Kroger products: ", error);
      throw error;
    }
  },
  fetchKrogerProductById: async (productId: string, locationId?: string) => {
    console.log("fetchKrogerProductById starting...");
    try {
      const url = locationId
        ? `/api/kroger?productId=${encodeURIComponent(
            productId
          )}&locationId=${locationId}`
        : `/api/kroger?productId=${encodeURIComponent(productId)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(
          `Error getting Kroger product by ID: ${response.statusText}`
        );
      }
      const data = await response.json();
      console.log("Kroger product response ID:", data);
      return data;
    } catch (error) {
      console.error("Error getting Kroger product by ID: ", error);
      throw error;
    }
  },
};
