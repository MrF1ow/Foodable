import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Get price request received",
    success: true,
  });
}
