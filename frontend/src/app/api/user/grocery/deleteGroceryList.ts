import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { isValidObjectId } from "@/utils/typeValidation/general";
import { currentUser } from "@clerk/nextjs/server";

export async function DELETE(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { id } = await req.json();
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }
    const db = await getDB();

    const deletedGroceryList = await db
      .collection("groceryLists")
      .findOneAndDelete({
        _id: ObjectId.createFromHexString(id),
        creatorId: clerkUser.id,
      });

    if (!deletedGroceryList) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Grocery List Deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting grocery list: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
