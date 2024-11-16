import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    message: "Register request received",
    success: true,
  });
}
