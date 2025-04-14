import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { NextResponse } from "next/server";
import { isValidObjectId } from "@/lib/utils/typeValidation/general";

export async function DELETE(id: any) {
    try {
        if (!isValidObjectId(id)) {
            return NextResponse.json(
                { message: HTTP_RESPONSES.BAD_REQUEST },
                { status: 400 }
            );
        }

        const db = await getDB();

        const pullResult = await db.collection("users").updateMany(
            { "savedItems.recipes": id },
            {
                $pull: {
                    "savedItems.recipes": id,
                },
            }
        );

        return NextResponse.json(
            {
                message: "Grocery list references cleaned up from all users",
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
