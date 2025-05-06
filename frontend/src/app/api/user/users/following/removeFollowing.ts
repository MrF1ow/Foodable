// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { currentUser } from "@clerk/nextjs/server";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

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

    // get and check current user profile
    const db = await getDB();
    const userProfile = await db.collection('users').findOne({ clerkId: clerkUser.id });

    if (!userProfile) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    const targetUserId = ObjectId.createFromHexString(followingId);

    // Prevent following yourself
    if (targetUserId.equals(userProfile._id)) {
      return NextResponse.json(
        { message: "You cannot unfollow yourself." },
        { status: 400 }
      );
    }

    // Remove the follower from the user's followers list
    const result = await db
      .collection("users")
      .updateOne(
        { clerkId: clerkUser.id },
        { $pull: { following: { _id: targetUserId } as any } }
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Follower not found or already removed" },
        { status: 404 }
      );
    }

    await db.collection('users').updateOne(
      { _id: targetUserId },
      { $pull: { followers: { _id: userProfile._id } as any } }
    );

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
