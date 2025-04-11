// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/lib/utils/validation";
import { validateGroceryList } from "@/lib/utils/typeValidation/grocery";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { GroceryList } from "@/types/grocery";

export async function PUT(req: Request) {
  try {
    const groceryList: GroceryList = await req.json();

    console.log("groceryList: ", groceryList);

    const preValidationResponse = validateObject(
      groceryList,
      validateGroceryList,
      HTTP_RESPONSES.BAD_REQUEST,
      400
    );

    console.log("preValidationResponse: ", preValidationResponse);

    if (preValidationResponse) {
      return preValidationResponse;
    }

    const db = await getDB();

    const { _id, ...groceryListWithoutId } = groceryList;

    const updatedGroceryList = await db
      .collection("groceryLists")
      .findOneAndUpdate(
        { _id: ObjectId.createFromHexString(_id) },
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

    console.log("validationResponse: ", validationResponse);

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
