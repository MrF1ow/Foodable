// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/utils/validation";
import { validateGroceryList } from "@/utils/typeValidation/grocery";
import { getValueFromSearchParams } from "@/utils/routeHelpers";

// Package Imports
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const fetchMetadata = getValueFromSearchParams(req, "metadata") === "true";

    console.log("fetchMetadata: ", fetchMetadata);

    const db = await getDB();

    const projection = fetchMetadata
      ? {
          type: "grocery",
          _id: 1,
          title: 1,
          category: 1,
        }
      : {};

    const groceryLists = await db
      .collection("groceryLists")
      .find({}, { projection })
      .toArray();

    if (!fetchMetadata) {
      for (const groceryList of groceryLists) {
        const validationResponse = validateObject(
          groceryList,
          validateGroceryList,
          HTTP_RESPONSES.BAD_REQUEST,
          400
        );
        if (validationResponse) {
          return validationResponse;
        }
      }
    }

    return NextResponse.json(groceryLists, { status: 200 });
  } catch (error) {
    console.error("Error getting grocery lists: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
