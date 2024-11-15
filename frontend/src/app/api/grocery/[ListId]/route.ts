import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Get grocery list request received",
    success: true,
  });
}
