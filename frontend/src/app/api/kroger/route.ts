import { NextRequest } from "next/server";
import { GET as getLocations } from "./getLocations";
import { GET as getProducts } from "./getProducts";

// There seems to be some CORS restriction on the Kroger API, so we can't directly fetch from the frontend
// Instead, we can create a proxy API that fetches from the Kroger API and returns the data to the frontend
export async function GET(request: NextRequest) {
  console.log("Routing to GET in kroger...");
  const { searchParams } = new URL(request.url);

  const zipCode = searchParams.get("zipCode");
  const term = searchParams.get("term");

  if (zipCode) {
    console.log("Routing to getLocations...");
    return getLocations(request);
  }
  if (term) {
    console.log("Routing to getProducts...");
    return getProducts(request);
  }
}
