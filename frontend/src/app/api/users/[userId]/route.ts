import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Get a User Profile request received",
    success: true,
  });
}
