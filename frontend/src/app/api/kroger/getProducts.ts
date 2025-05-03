import { getAccessToken } from "@/lib/utils/getAccessToken";
import { getValueFromSearchParams } from "@/lib/utils/routeHelpers";
import { NextResponse } from "next/server";

interface ProductResponse {
  data: Array<{
    productId: string;
    aisleLocations?: Array<{
      bayNumber: string;
      description: string;
      number: string;
      numberOfFacings: string;
      side: string;
      shelfNumber: string;
      shelfPositionInBay: string;
    }>;
    description: string;
    brand: string;
    size: string;
    images: Array<{ perspective: string; sizes: Array<{ url: string }> }>;
    items: Array<{
      price?: {
        regular: number;
        promo?: number;
      };
    }>;
  }>;
}

// Adapted from https://developer-ce.kroger.com/documentation/api-products/public/products/tutorial
export async function GET(req: Request) {
  console.log("Getting Kroger products...");

  const searchTerm = getValueFromSearchParams(req, "term");
  if (!searchTerm) {
    return NextResponse.json({ error: "Missing search term" }, { status: 400 });
  }
  console.log("Search term:", searchTerm);

  const locationId =
    getValueFromSearchParams(req, "locationId") ||
    getValueFromSearchParams(req, "filter.locationId") ||
    "";

  console.log("Location ID:", locationId);
  const searchByLocation = locationId ? `&filter.locationId=${locationId}` : "";
  const limit = getValueFromSearchParams(req, "pagination.limit") ?? "50";
  const filterLimit = limit ? `&filter.limit=${limit}` : "";

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: "Failed to retrieve access token" },
      { status: 500 }
    );
  }

  const productsUrl = `${process.env.NEXT_PUBLIC_KROGER_API_BASE_URL}/products?filter.term=${searchTerm}${searchByLocation}${filterLimit}`;
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
    console.log("getProducts response:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
