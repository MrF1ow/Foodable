import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Recipe creation request received",
    success: true,
  });
}
