// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";

// Package Imports
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser || !clerkUser.id) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const db = await getDB();

        const user = await db
            .collection("users")
            .findOne({ clerkId: clerkUser.id });

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error getting current self:", error);

        return NextResponse.json(
            { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
            { status: 500 }
        );
    }
}
