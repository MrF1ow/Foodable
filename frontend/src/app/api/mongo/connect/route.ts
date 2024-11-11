// import client from "../../../../lib/mongodb";
import { dbConnect } from "../../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const connection = await dbConnect();
    return new NextResponse("Connected to MongoDB", { status: 200 });
  } catch (err) {
    console.error("Failed to connect:", err);
    return new NextResponse("Failed to connect to MongoDB", { status: 500 });
  }
}
