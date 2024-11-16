import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Price comparison request received",
    success: true,
  });
}
