import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { NextResponse } from "next/server";
import { isValidObjectId } from "@/lib/validation/types/general";
import { ObjectId } from "mongodb";

export async function DELETE(id: any) {
    try {
        if (!isValidObjectId(id)) {
            return NextResponse.json(
                { message: HTTP_RESPONSES.BAD_REQUEST },
                { status: 400 }
            );
        }

        const db = await getDB();
        const objectId = ObjectId.createFromHexString(id);


        const pullResult = await db.collection("users").updateMany(
            { "savedItems.recipes._id": objectId },
            {
                $pull: {
                    "savedItems.recipes": { _id: objectId },
                },
            } as any
        );

        return NextResponse.json(
            {
                message: "Recipe references cleaned up from all users",
                removedFromSavedItems: pullResult.modifiedCount,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Bulk user recipe cleanup error: ", error);
        return NextResponse.json(
            { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
            { status: 500 }
        );
    }
}
