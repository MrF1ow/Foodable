// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";

// Package Imports
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/user";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const { userData, error, status } = await getCurrentUser<
      { settings: any }>({
        settings: 1
      });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

    return NextResponse.json(
      {
        settings: userData.settings ?? {},
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting user settings: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
