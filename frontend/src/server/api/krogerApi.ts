import { getAccessToken } from "@/utils/getAccessToken";
import fetchWithAuth from "../fetchInstance";
interface ProductResponse {
  data: Array<{
    productId: string;
    description: string;
    brand: string;
    size: string;
    price: {
      regular: number;
      promo?: number;
    };
    images: Array<{ perspective: string; sizes: Array<{ url: string }> }>;
  }>;
}

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
      return data;
    } catch (error) {
      console.error("Error getting Kroger locations: ", error);
      throw error;
    }
  },
  fetchKrogerProducts: async (term: string, locationId?: string) => {
    console.log("Getting Kroger products...");

    console.log("Location ID:", locationId);
    let searchByLocation = locationId ? `&filter.locationId=${locationId}` : "";

    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.log("Failed to retrieve access token");
      return new Response("Failed to retrieve access token", { status: 500 });
    }

    const productsUrl = `${process.env.NEXT_PUBLIC_KROGER_API_BASE_URL}/products?filter.term=${term}${searchByLocation}`;
    console.log("Products URL:", productsUrl);

    try {
      const response = await fetch(productsUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data: ProductResponse = await response.json();
      console.log("Products response:", data);
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error: any) {
      console.error("Error fetching products:", error);
      return new Response("Failed to fetch products", {
        status: error.response?.status || 500,
      });
    }
  },
};
