// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";
import { validateObject, validateGroceryList } from "@/utils/validation";
import { getIdFromSearchParams } from "@/utils/routeHelpers";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const id = getIdFromSearchParams(req);
    if (!id) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }
    const db = await getDB();

    const groceryList = await db
      .collection("groceryLists")
      .findOne({ _id: new ObjectId(id) });

    const validationResponse = validateObject(
      groceryList,
      validateGroceryList,
      HTTP_RESPONSES.BAD_REQUEST,
      400
    );

    if (validationResponse) {
      return validationResponse;
    }

    return NextResponse.json(groceryList, { status: 200 });
  } catch (error) {
    console.error("Error getting grocery list: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
