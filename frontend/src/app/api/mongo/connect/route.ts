import connectDB  from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await connectDB();
    const db = client.db("foodable_db");
    const test = await db.collection("users").find({}).toArray();
    console.log(test);
    return new NextResponse("Connected to MongoDB", { status: 200 });
  } catch (err) {
    console.error("Failed to connect:", err);
    return new NextResponse("Failed to connect to MongoDB", { status: 500 });
  }
}
