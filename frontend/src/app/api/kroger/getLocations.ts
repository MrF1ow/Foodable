import { getValueFromSearchParams } from "@/lib/utils/routeHelpers";
import { getAccessToken } from "@/lib/utils/getAccessToken";
import { NextResponse } from "next/server";

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

export async function GET(req: Request) {
  console.log("Getting Kroger locations...");

  const zipCode = getValueFromSearchParams(req, "zipCode");
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
}
