// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/lib/utils/validation";
import { validateGroceryList } from "@/lib/utils/typeValidation/grocery";

// Package Imports
import { NextResponse } from "next/server";
import { GroceryList } from "@/types/grocery";
import { currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { formEmbeddingData, insertEmbeddings } from "@/lib/utils/embeddings";
import { getCurrentUser } from "@/lib/utils/user";

export async function PUT(req: Request) {
  try {
    const { userData, error, status } = await getCurrentUser<
      { _id: ObjectId }>({
        _id: 1,
      });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

    const db = await getDB();

    const groceryList: GroceryList = await req.json();

    const preValidationResponse = validateObject(
      groceryList,
      validateGroceryList,
      HTTP_RESPONSES.BAD_REQUEST,
      400
    );

    if (preValidationResponse) {
      return preValidationResponse;
    }

    const { _id, creatorId, ...groceryListWithoutId } = groceryList;

    const updatedGroceryList = await db
      .collection("groceryLists")
      .findOneAndUpdate(
        { _id: ObjectId.createFromHexString(_id.toString()), creatorId: userData._id },
        { $set: groceryListWithoutId },
        { returnDocument: "after" }
      );

    if (!updatedGroceryList) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    const validationResponse = validateObject(
      updatedGroceryList,
      validateGroceryList,
      HTTP_RESPONSES.BAD_REQUEST,
      404
    );

    if (validationResponse) {
      return validationResponse;
    }

    const embeddingData = formEmbeddingData("grocery", groceryList, ObjectId.createFromHexString(_id.toString()))

    await insertEmbeddings([embeddingData]);

    return NextResponse.json(updatedGroceryList, { status: 200 });
  } catch (error) {
    console.error("Error updating grocery list: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
