import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { isValidObjectId } from "@/lib/utils/typeValidation/general";
import { currentUser } from "@clerk/nextjs/server";
import { deleteVectorEmbedding } from "@/lib/utils/embeddings";

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

    const groceryListId = ObjectId.createFromHexString(id.toString());

    console.log(groceryListId)

    // delete the grocery list
    const deletedGroceryList = await db
      .collection("groceryLists")
      .findOneAndDelete({
        _id: groceryListId,
        creatorId: userProfile._id,
      });

    if (!deletedGroceryList) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Remove the deleted ID from savedItems.groceryLists
    const updatedSavedLists =
      userProfile.savedItems?.groceryLists?.filter(
        (list: { _id: string | ObjectId }) => list._id.toString() !== id.toString()
      ) || [];

    // Apply the filtered list back to the user profile
    if (userProfile.savedItems) {
      userProfile.savedItems.groceryLists = updatedSavedLists;
    }

    const updateFields: Record<string, any> = {
      "savedItems.groceryLists": updatedSavedLists,
    };

    // Reset currentGroceryList if it matches the deleted ID
    if (userProfile.currentGroceryList?.toString() === id.toString()) {
      // If there's another saved list, set it as current; otherwise, null
      updateFields.currentGroceryList = updatedSavedLists[0]?._id || null;
    }

    await db.collection("users").updateOne(
      { clerkId: clerkUser.id },
      { $set: updateFields }
    );

    await deleteVectorEmbedding(groceryListId);


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
