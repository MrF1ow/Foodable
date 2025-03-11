// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { currentUser } from "@clerk/nextjs/server";

// Package Imports
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { followingId } = await req.json();

    if (!followingId) {
      return NextResponse.json(
        { message: "Follower ID is required" },
        { status: 400 }
      );
    }

    const db = await getDB();

    // Remove the follower from the user's followers list
    const result = await db
      .collection("users")
      .updateOne(
        { clerkId: clerkUser.id },
        { $pull: { following: { userId: followingId } as any } }
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Follower not found or already removed" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Follower removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing follower: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
