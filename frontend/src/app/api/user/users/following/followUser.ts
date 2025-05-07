// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { currentUser } from "@clerk/nextjs/server";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { FollowMetadata } from "@/types/user";
import { getCurrentUser } from "@/lib/utils/user";

export async function POST(req: Request) {
    try {
        const { userData, error, status } = await getCurrentUser<
            { _id: ObjectId, imageId: ObjectId, username: string, following: any }>({
                _id: 1,
                imageId: 1,
                username: 1,
                following: 1
            });

        if (!userData) {
            return NextResponse.json({ message: error }, { status });
        }

        // get and check current user profile
        const db = await getDB();

        // ensure proper metadata information is passed into API call
        const { _id, imageId, username } = await req.json()

        if (!_id || !imageId || !username) {
            return NextResponse.json(
                { message: HTTP_RESPONSES.BAD_REQUEST },
                { status: 400 }
            )
        }

        const targetUserId = ObjectId.createFromHexString(_id);

        // Prevent following yourself
        if (targetUserId.equals(userData._id)) {
            return NextResponse.json(
                { message: "You cannot follow yourself." },
                { status: 400 }
            );
        }

        // prevent following the person if you already do
        const alreadyFollowing = userData.following?.some(
            (f: any) => f._id.toString() === _id
        );
        if (alreadyFollowing) {
            return NextResponse.json(
                { message: "Already following this user." },
                { status: 400 }
            );
        }

        // add target user to following array
        const targetUserData: FollowMetadata = {
            _id: targetUserId,
            imageId: ObjectId.createFromHexString(imageId),
            username
        };

        const currentUserData: FollowMetadata = {
            _id: userData._id,
            imageId: userData.imageId,
            username: userData.username,
        }

        await db.collection('users').updateOne(
            { _id: userData._id },
            { $addToSet: { following: targetUserData } }
        );

        // Add current user to target user's followers
        const updateResult = await db.collection('users').updateOne(
            { _id: targetUserId },
            { $addToSet: { followers: currentUserData } }
        );

        if (updateResult.modifiedCount === 0) {
            console.warn("Target user not found or follower not added.");
        }

        return NextResponse.json({ message: "User added to Following" }, { status: 201 });
    } catch (error) {
        console.error("Error getting followings: ", error);

        return NextResponse.json(
            { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
            { status: 500 }
        );
    }
}
