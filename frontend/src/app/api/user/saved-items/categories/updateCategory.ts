import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { oldCategory, newCategory } = await req.json();

    if (!oldCategory || !newCategory) {
      return NextResponse.json(
        { message: "Both oldCategory and newCategory are required" },
        { status: 400 }
      );
    }

    const db = await getDB();
    const usersCollection = db.collection("users");

    const result = await usersCollection.updateOne(
      { clerkId: clerkUser.id, "savedItems.recipes.category": oldCategory },
      { $set: { "savedItems.recipes.$[elem].category": newCategory } },
      { arrayFilters: [{ "elem.category": oldCategory }] }
    );

    const groceryResult = await usersCollection.updateOne(
      {
        clerkId: clerkUser.id,
        "savedItems.groceryLists.category": oldCategory,
      },
      { $set: { "savedItems.groceryLists.$[elem].category": newCategory } },
      { arrayFilters: [{ "elem.category": oldCategory }] }
    );

    if (result.modifiedCount === 0 && groceryResult.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No items found with this category" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
