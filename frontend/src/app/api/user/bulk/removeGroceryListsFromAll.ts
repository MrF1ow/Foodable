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
            { "savedItems.groceryLists": id },
            {
                $pull: {
                    "savedItems.groceryLists": id,
                },
            }
        );

        const resetCurrentResult = await db.collection("users").updateMany(
            { currentGroceryList: id },
            { $set: { currentGroceryList: null } }
        );

        return NextResponse.json(
            {
                message: "Grocery list references cleaned up from all users",
                removedFromSavedItems: pullResult.modifiedCount,
                resetCurrentGroceryList: resetCurrentResult.modifiedCount,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Bulk user grocery cleanup error: ", error);
        return NextResponse.json(
            { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
            { status: 500 }
        );
    }
}
