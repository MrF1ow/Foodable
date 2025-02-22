import { GET as getImage } from "./getImage";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return getImage(request);
}
