import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Get item inventory request received",
    success: true,
  });
}
