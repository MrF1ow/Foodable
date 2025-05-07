// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/utils/user";

export async function PUT(req: Request) {
  try {
    const { userData, error, status } = await getCurrentUser<
      { _id: ObjectId }>({
        _id: 1
      });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
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
      { _id: userData._id },
      {
        $set: {
          settings: settings,
        },
      }
    );

    if (result.modifiedCount === 0) {
      console.warn("User Settings Already Updated");
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
