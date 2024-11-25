// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/httpResponses";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const getUseById = async (userId: string) => {
  try {
    const db = await getDB();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    // If user is not found, return 404
    if (!user) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Return user
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);

    // Return 500 if there is an error
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
};
