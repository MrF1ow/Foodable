// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { currentUser } from "@clerk/nextjs/server";

// Package Imports
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/user";
import { UserPreferences } from "@/types/user";

export async function GET() {
  try {
    const { userData, error, status } = await getCurrentUser<{ preferences: UserPreferences }>({
      preferences: 1,
    });
    
    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

    return NextResponse.json(
      {
        preferences: userData.preferences ?? {},
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting use preferences: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
