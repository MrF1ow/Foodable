import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { currentUser } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
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

    const recipeCategories =
      user.savedItems?.recipes?.map((r: { category: string }) => r.category) ||
      [];
    const groceryCategories =
      user.savedItems?.groceryLists?.map(
        (g: { category: string }) => g.category
      ) || [];

    const categories = [
      ...new Set([...recipeCategories, ...groceryCategories]),
    ];

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error saving item:", error);
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
