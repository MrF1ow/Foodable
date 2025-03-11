// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { currentUser } from "@clerk/nextjs/server";

// Package Imports
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { settings } = await req.json();

    if (!settings) {
      return NextResponse.json(
        { message: "Invalid data: settings are required" },
        { status: 400 }
      );
    }

    const db = await getDB();

    const result = await db.collection("users").updateOne(
      { clerkId: clerkUser.id },
      {
        $set: {
          settings: settings,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "User update failed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "User settings updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user settings: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
