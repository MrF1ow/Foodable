import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { currentUser } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/user";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const { userData, error, status } = await getCurrentUser<
      { _id: ObjectId, savedItems: any }>({
        _id: 1,
        savedItems: 1
      });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

    const db = await getDB();

    const recipeCategories =
      userData.savedItems?.recipes?.map((r: { category: string }) => r.category) ||
      [];
    const groceryCategories =
      userData.savedItems?.groceryLists?.map(
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
