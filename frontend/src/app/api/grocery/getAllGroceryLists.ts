// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/utils/validation";
import { validateGroceryList } from "@/utils/typeValidation/grocery";

// Package Imports
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDB();

    const groceryLists = await db.collection("groceryLists").find().toArray();

    const validationResponses = groceryLists.map((list) =>
      validateObject(list, validateGroceryList, HTTP_RESPONSES.BAD_REQUEST, 400)
    );

    const invalidResponse = validationResponses.find((response) => response);
    if (invalidResponse) {
      return invalidResponse;
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
