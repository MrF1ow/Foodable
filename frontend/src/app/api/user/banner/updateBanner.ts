import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { getDB } from "@/lib/mongodb";
import { isValidObjectId } from "@/lib/utils/validation";
import { currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";


export async function PUT(req: Request) {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser || !clerkUser.id) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const db = await getDB();
        const userProfile = await db.collection('users').findOne({ clerkId: clerkUser.id });

        if (!userProfile) {
            return NextResponse.json(
                { message: HTTP_RESPONSES.NOT_FOUND },
                { status: 404 }
            );
        }

        const { bannerId } = await req.json();

        if (!bannerId || !isValidObjectId(bannerId)) {
            return NextResponse.json(
                { message: HTTP_RESPONSES.BAD_REQUEST },
                { status: 400 }
            );
        }

        const updatedFields = {
            "imageId": ObjectId.createFromHexString(bannerId)
        }

        await db.collection("users").updateOne(
            { clerkId: clerkUser.id },
            { $set: updatedFields }
        )

        return NextResponse.json(
            { message: "User Banner Updated" },
            { status: 200 }
        )
    } catch (error) {
        console.log("Error deleting recipe", error);

        return NextResponse.json(
            { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
            { status: 500 }
        );
    }
}