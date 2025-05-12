// Local Imports
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { getCurrentUser } from "@/lib/utils/user";
import { UserPreferences } from "@/types/user";

// Package Imports
import { NextResponse } from "next/server";

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
