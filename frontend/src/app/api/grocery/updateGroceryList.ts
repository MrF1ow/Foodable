// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";
import {
  validateObject,
  isValidObjectId,
  validateGroceryList,
} from "@/utils/validation";
import { GroceryList } from "@/types";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(req: Request) {
  try {
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

    const { id, ...groceryListWithoutId } = groceryList;

    const db = await getDB();

    const updatedGroceryList = await db
      .collection("groceryLists")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: groceryListWithoutId },
        { returnDocument: "after" }
      );

    if (!updatedGroceryList) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

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
