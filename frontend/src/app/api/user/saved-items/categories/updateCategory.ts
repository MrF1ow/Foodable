import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/user";
import { ObjectId } from "mongodb";

export async function PUT(req: Request) {
  try {
    const { userData, error, status } = await getCurrentUser<
      { _id: ObjectId, savedItems: any }>({
        _id: 1,
        savedItems: 1
      });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
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
      {
        _id: userData._id,
        "savedItems.groceryLists.category": oldCategory,
        "savedItems.recipes.category": oldCategory
      },
      {
        $set: { "savedItems.groceryLists.$[elem].category": newCategory, "savedItems.recipes.$[elem].category": newCategory },
      },
      { arrayFilters: [{ "elem.category": oldCategory }] }
    );

    if (result.modifiedCount === 0) {
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
