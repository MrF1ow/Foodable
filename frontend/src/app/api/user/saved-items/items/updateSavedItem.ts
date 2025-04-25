import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { isValidObjectId } from "@/lib/utils/typeValidation/general";
import { currentUser } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(req: Request) {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser || !clerkUser.id) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const requestBody = await req.json();
        const { _id, title, category, type, imageId, tags } = requestBody;

        if (!_id || !title || !category || !type) {
            return NextResponse.json({ message: "Missing metadata" }, { status: 400 });
        }

        if (!isValidObjectId(_id)) {
            return NextResponse.json({ message: "Invalid _id" }, { status: 400 });
        }

        const db = await getDB();
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne(
            { clerkId: clerkUser.id },
            { projection: { savedItems: 1 } }
        );

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        let updateResult;

        if (type === "recipe") {
            if (!imageId || !tags) {
                return NextResponse.json({ message: "Missing recipe metadata" }, { status: 400 });
            }

            updateResult = await usersCollection.updateOne(
                {
                    clerkId: clerkUser.id,
                    "savedItems.recipes._id": ObjectId.createFromHexString(_id),
                },
                {
                    $set: {
                        "savedItems.recipes.$.title": title,
                        "savedItems.recipes.$.category": category,
                        "savedItems.recipes.$.imageId": ObjectId.createFromHexString(imageId),
                        "savedItems.recipes.$.tags": tags,
                    },
                }
            );
        } else if (type === "groceryList") {
            updateResult = await usersCollection.updateOne(
                {
                    clerkId: clerkUser.id,
                    "savedItems.groceryLists._id": ObjectId.createFromHexString(_id),
                },
                {
                    $set: {
                        "savedItems.groceryLists.$.title": title,
                        "savedItems.groceryLists.$.category": category,
                    },
                }
            );
        } else {
            return NextResponse.json({ message: "Unsupported type" }, { status: 400 });
        }

        if (!updateResult.modifiedCount) {
            return NextResponse.json({ message: "Item not found or not modified" }, { status: 404 });
        }

        return NextResponse.json({ message: "Item updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating item:", error);
        return NextResponse.json(
            { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
            { status: 500 }
        );
    }
}
