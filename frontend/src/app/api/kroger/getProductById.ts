import { getAccessToken } from "@/lib/utils/getAccessToken";
import { getValueFromSearchParams } from "@/lib/utils/routeHelpers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const productId = getValueFromSearchParams(req, "productId");
  if (!productId) {
    return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
  }
  const productIdQuery = `filter.productId=${productId}`;

  const locationId = getValueFromSearchParams(req, "locationId") || "";
  const locationQuery = locationId ? `&filter.locationId=${locationId}` : "";

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: "Failed to retrieve access token" },
      { status: 500 }
    );
  }

  const productUrl = `${process.env.NEXT_PUBLIC_KROGER_API_BASE_URL}/products?${productIdQuery}${locationQuery}`;
  console.log("Product URL:", productUrl);

  try {
    const response = await fetch(productUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch product (${response.status})` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
