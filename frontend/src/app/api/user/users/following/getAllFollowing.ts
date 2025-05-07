// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { currentUser } from "@clerk/nextjs/server";

// Package Imports
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/user";

export async function GET() {
  try {
    const { userData, error, status } = await getCurrentUser<
      { following: any }>({
        following: 1
      });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

    return NextResponse.json(userData.following ?? [], { status: 200 });
  } catch (error) {
    console.error("Error getting followings: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
