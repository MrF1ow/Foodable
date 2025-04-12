// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateGroceryListWithoutId } from "@/utils/typeValidation/grocery";
import { isValidObjectId } from "@/utils/validation";
import { NewGroceryList } from "@/types/grocery";

// Package Imports
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const groceryList: NewGroceryList = await req.json();

    const { _id, ...groceryListToInsert } = {
      ...groceryList,
      title: groceryList.title,
      items: groceryList.items || [],
      timestamp: groceryList.timestamp || new Date(),
    };

    if (!validateGroceryListWithoutId(groceryListToInsert, isValidObjectId)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const db = await getDB();

    const result = await db
      .collection("groceryLists")
      .insertOne(groceryListToInsert);

    const insertedGroceryList = await db
      .collection("groceryLists")
      .findOne({ _id: result.insertedId });

    // return the entire grocery list
    return NextResponse.json(insertedGroceryList, { status: 201 });
  } catch (error) {
    console.error("Error creating grocery list: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
