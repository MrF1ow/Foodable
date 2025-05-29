import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { isValidObjectId } from "@/lib/validation/types/general";
import { deleteVectorEmbedding } from "@/lib/utils/embeddings";
import { getCurrentUser } from "@/lib/utils/user";

export async function DELETE(req: Request) {
  try {
    const { userData, error, status } = await getCurrentUser<{
      _id: ObjectId;
      currentGroceryList: ObjectId;
      savedItems: any;
      createdItems: any;
    }>({
      _id: 1,
      currentGroceryList: 1,
      savedItems: 1,
      createdItems: 1,
    });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

    const { id } = await req.json();
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 },
      );
    }
    const db = await getDB();

    const groceryListId = ObjectId.createFromHexString(id.toString());

    const groceryListDoc = await db
      .collection("groceryLists")
      .findOne({ _id: groceryListId });

    if (!groceryListDoc) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 },
      );
    }

    let wasDeleted = false;

    // If the user is the creator, delete the list entirely
    if (groceryListDoc.creatorId?.toString() === userData._id.toString()) {
      const result = await db.collection("groceryLists").findOneAndDelete({
        _id: groceryListId,
        creatorId: userData._id,
      });

      if (!result) {
        return NextResponse.json(
          { message: HTTP_RESPONSES.NOT_FOUND },
          { status: 404 },
        );
      }

      wasDeleted = true;
    }

    // Remove the deleted ID from savedItems.groceryLists
    const updatedSavedLists =
      userData.savedItems?.groceryLists?.filter(
        (list: { _id: string | ObjectId }) =>
          list._id.toString() !== id.toString(),
      ) || [];


    const updatedCreatedItems =
      userData.createdItems?.filter(
        (items: { _id: string | ObjectId }) =>
          items._id.toString() !== id.toString(),
      ) || [];


    const updateFields: Record<string, any> = {
      "savedItems.groceryLists": updatedSavedLists,
      "createdItems": updatedCreatedItems,
    };

    // Reset currentGroceryList if it matches the deleted ID
    if (userData.currentGroceryList?.toString() === id.toString()) {
      // If there's another saved list, set it as current; otherwise, null
      updateFields.currentGroceryList = updatedSavedLists[0]?._id || null;
    }

    await db.collection("users").updateOne(
      { _id: userData._id },
      {
        $set: updateFields
      }
    );

    if (wasDeleted) {
      await deleteVectorEmbedding(groceryListId);
    }

    return NextResponse.json({ message: HTTP_RESPONSES.OK }, { status: 200 });
  } catch (error) {
    console.error("Error deleting grocery list: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 },
    );
  }
}
