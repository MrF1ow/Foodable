import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { isValidObjectId } from "@/utils/typeValidation/general";
import { currentUser } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { category } = await req.json();

    if (!category) {
      return NextResponse.json(
        { message: "category is required" },
        { status: 400 }
      );
    }
    const db = await getDB();
    const usersCollection = db.collection("users");

    const result = await usersCollection.updateOne(
        { clerkId: clerkUser.id },
        {
          $pull: {
            "savedItems.recipes": {
              category: category, // directly match the category value
            } as any,
            "savedItems.groceryLists": {
              category: category, // directly match the category value
            } as any,
          },
        }
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No items found with this category" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving item:", error);
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
