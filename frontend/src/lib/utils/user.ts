import { currentUser } from "@clerk/nextjs/server";
import { HTTP_RESPONSES } from "../constants/httpResponses";
import { getDB } from "../mongodb";

export async function getCurrentUser<T = any>(
    projection?: Record<string, number>
): Promise<{
    userData: T | null;
    error: string | null;
    status: number;
}> {
    const clerkUser = await currentUser();

    if (!clerkUser?.id) {
        return { userData: null, error: "User not found", status: 404 };
    }

    const db = await getDB();
    const data = await db.collection("users").findOne(
        { clerkId: clerkUser.id },
        projection ? { projection } : undefined
    );

    if (!data) {
        return {
            userData: null,
            error: HTTP_RESPONSES.NOT_FOUND ?? "User profile not found",
            status: 404,
        };
    }

    return { userData: data as T, error: null, status: 200 };
}