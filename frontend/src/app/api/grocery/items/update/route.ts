import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Update grocery list request received",
    success: true,
  });
}
