import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { isValidObjectId } from "@/lib/utils/typeValidation/general";
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
    const userProfile = await db.collection('users').findOne({ clerkId: clerkUser.id });

    if (!userProfile) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    // delete the grocery list
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

    // Remove the deleted ID from savedItems.groceryLists
    const updatedSavedLists = (userProfile.savedItems?.groceryLists || []).filter(
      (listId: string) => listId !== id
    );

    console.log("Updated saved lists: ", updatedSavedLists);

    const updateFields: any = {
      'savedItems.groceryLists': updatedSavedLists,
    };

    if (userProfile.currentGroceryList === id) {
      updateFields.currentGroceryList = updatedSavedLists[0] || null;
    }

    await db.collection("users").updateOne(
      { clerkId: clerkUser.id },
      { $set: updateFields }
    );

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
