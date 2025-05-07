import { currentUser } from "@clerk/nextjs/server";
import { HTTP_RESPONSES } from "../constants/httpResponses";
import { getDB } from "../mongodb";


export async function getCurrentUser() {
    const clerkUser = await currentUser();

    if (!clerkUser?.id) {
        return { user: null, error: "User not found", status: 404 };
    }

    const db = await getDB();
    const userProfile = await db.collection("users").findOne({ clerkId: clerkUser.id });

    if (!userProfile) {
        return { user: null, error: HTTP_RESPONSES.NOT_FOUND ?? "User profile not found", status: 404 };
    }

    return { user: userProfile, error: null, status: 200 };
}