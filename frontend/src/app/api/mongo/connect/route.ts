// import client from "../../../../lib/mongodb";
import connectDB from "@/lib/mongodb";
// import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await connectDB();
    const db = client.db("foodable_db");
    const test = await db.collection("test").find({}).toArray();
    console.log(test);
    // const client = await clientPromise;
    return new NextResponse("Connected to MongoDB", { status: 200 });
  } catch (err) {
    console.error("Failed to connect:", err);
    return new NextResponse("Failed to connect to MongoDB", { status: 500 });
  }
}
