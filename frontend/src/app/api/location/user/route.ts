import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Getting user location request received",
    success: true,
  });
}
