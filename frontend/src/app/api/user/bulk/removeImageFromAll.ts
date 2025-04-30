

import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { NextResponse } from "next/server";
import { isValidObjectId } from "@/lib/utils/typeValidation/general";
import { ObjectId } from "mongodb";
import { currentUser } from "@clerk/nextjs/server";

export async function DELETE(id: any) {
    try {
        if (!isValidObjectId(id)) {
            return NextResponse.json(
                { message: HTTP_RESPONSES.BAD_REQUEST },
                { status: 400 }
            );
        }
        const clerkUser = await currentUser();

        if (!clerkUser || !clerkUser.id) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const db = await getDB();

        const userProfile = await db.collection('users').findOne({ clerkId: clerkUser.id });

        if (!userProfile) {
            return NextResponse.json({
                message: HTTP_RESPONSES.NOT_FOUND
            },
                { status: 404 })
        }
        const imageObjectId = ObjectId.createFromHexString(id);

        const userImageUpdate = await db.collection("users").updateMany(
            { imageId: imageObjectId },
            { $set: { imageId: null } }
        );

        const followingUpdate = await db.collection("users").updateMany(
            { "following.imageId": imageObjectId },
            {
                $set: { "following.$[elem].imageId": null }
            },
            {
                arrayFilters: [{ "elem.imageId": imageObjectId }]
            }
        );

        const followersUpdate = await db.collection("users").updateMany(
            { "followers.imageId": imageObjectId },
            {
                $set: { "followers.$[elem].imageId": null }
            },
            {
                arrayFilters: [{ "elem.imageId": imageObjectId }]
            }
        );
        return NextResponse.json(
            {
                message: "Image bulk removal successful",
                updated: {
                    topLevel: userImageUpdate.modifiedCount,
                    followingRefs: followingUpdate.modifiedCount,
                    followerRefs: followersUpdate.modifiedCount,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Bulk user image cleanup error: ", error);
        return NextResponse.json(
            { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
            { status: 500 }
        );
    }
}
