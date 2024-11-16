import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Getting nearby stores request received",
    success: true,
  });
}
