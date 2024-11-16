import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Create recipe request received",
    success: true,
  });
}
