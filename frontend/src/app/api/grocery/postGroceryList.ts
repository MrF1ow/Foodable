// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";
import { validateGroceryListWithoutId } from "@/utils/validation";
import { NewGroceryList } from "@/types";

// Package Imports
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const groceryList: NewGroceryList = await req.json();

    const groceryListToInsert: NewGroceryList = {
      ...groceryList,
      title: groceryList.title,
      items: [],
      timestamp: groceryList.timestamp || new Date(),
    };

    if (!validateGroceryListWithoutId(groceryListToInsert)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const db = await getDB();

    const result = await db
      .collection("groceryLists")
      .insertOne(groceryListToInsert);

    return NextResponse.json({ _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error creating grocery list: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
