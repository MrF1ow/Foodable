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
    const { id } = groceryList;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    if (!validateGroceryList(groceryList)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const db = await getDB();

    const groceryListRecord = await db
      .collection("groceryLists")
      .findOne({ _id: new ObjectId(id) });
    if (!groceryListRecord) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    const updatedGroceryList = await db
      .collection("groceryLists")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: groceryList },
        { returnDocument: "after" }
      );

    if (!updatedGroceryList || !updatedGroceryList.value) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    const validationResponse = validateObject(
      updatedGroceryList.value,
      validateGroceryList,
      HTTP_RESPONSES.BAD_REQUEST,
      404
    );

    if (validationResponse) {
      return validationResponse;
    }

    return NextResponse.json(updatedGroceryList.value, { status: 200 });
  } catch (error) {
    console.error("Error updating grocery list: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
