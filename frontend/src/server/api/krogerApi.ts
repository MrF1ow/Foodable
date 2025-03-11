import { getAccessToken } from "@/utils/getAccessToken";
import { NextResponse } from "next/server";

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

interface LocationResponse {
  data: Array<{
    locationId: string;
    chain: string;
    name: string;
    address: {
      addressLine1: string;
      city: string;
      state: string;
      zipCode: string;
    };
    geolocation: {
      latitude: number;
      longitude: number;
    };
  }>;
}

export const KrogerApi = {
  fetchKrogerLocations: async (zipCode: string) => {
    console.log("Getting Kroger locations...");

    if (!zipCode) {
      return NextResponse.json({ error: "Missing zipCode" }, { status: 400 });
    }
    console.log("Zipcode:", zipCode);

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { error: "Failed to retrieve access token" },
        { status: 500 }
      );
    }
    console.log("accessToken:", accessToken);

    const locationUrl = `${process.env.NEXT_PUBLIC_KROGER_API_BASE_URL}/locations?filter.zipCode.near=${zipCode}`;

    try {
      const response = await fetch(locationUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LocationResponse = await response.json();
      console.log("Locations response:", data);
      return NextResponse.json(data, { status: 200 });
    } catch (error: any) {
      return NextResponse.json(
        { error: "Failed to fetch locations" },
        { status: error.response?.status || 500 }
      );
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
