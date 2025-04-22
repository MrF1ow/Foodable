// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/lib/utils/validation";
import { validateGroceryList } from "@/lib/utils/typeValidation/grocery";

// Package Imports
import { NextResponse } from "next/server";
import { GroceryList } from "@/types/grocery";
import { currentUser } from "@clerk/nextjs/server";

export async function PUT(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const db = await getDB();
    const userProfile = await db.collection('users').findOne({ clerkId: clerkUser.id });

    if (!userProfile) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

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

    console.log("Grocery List", groceryList)

    const { _id, creatorId, ...groceryListWithoutId } = groceryList;

    const updatedGroceryList = await db
      .collection("groceryLists")
      .findOneAndUpdate(
        { _id: _id, creatorId: userProfile._id },
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

    return NextResponse.json(updatedGroceryList, { status: 200 });
  } catch (error) {
    console.error("Error updating grocery list: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
