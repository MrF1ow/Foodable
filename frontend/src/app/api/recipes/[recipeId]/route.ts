import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Get a recipe request received",
    success: true,
  });
}
