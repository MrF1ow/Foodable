import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { getDB } from "@/lib/mongodb";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const db = await getDB();

    const user = await db
      .collection("users")
      .findOne(
        { clerkId: clerkUser.id },
        { projection: { currentGroceryList: 1 } }
      );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { currentGroceryList: user.currentGroceryList || null },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching current grocery list: ", error);
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
