import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";
import { isValidObjectId } from "@/utils/validation";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(req: Request) {
  try {
    const { userId, itemId } = await req.json();

    if (!userId || !itemId) {
      return NextResponse.json(
        { message: "userId and itemId are required" },
        { status: 400 }
      );
    }

    if (!isValidObjectId(userId) || !isValidObjectId(itemId)) {
      return NextResponse.json(
        { message: "Invalid userId or itemId" },
        { status: 400 }
      );
    }

    const db = await getDB();
    const usersCollection = db.collection("users");

    const result = await usersCollection.updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      { $pull: { savedItems: itemId } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Item not found or user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Item removed from savedItems successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing item:", error);
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
