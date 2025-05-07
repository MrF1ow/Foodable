import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { getDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/utils/user";
import { isValidObjectId } from "@/lib/utils/validation";
import { currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";


export async function PUT(req: Request) {
    try {
        const { userData, error, status } = await getCurrentUser();

        if (!userData) {
            return NextResponse.json({ message: error }, { status });
        }

        const db = await getDB();
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
            { _id: userData._id },
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