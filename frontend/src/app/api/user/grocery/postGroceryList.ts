// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateGroceryListWithoutId } from "@/lib/utils/typeValidation/grocery";
import { isValidObjectId } from "@/lib/utils/validation";
import { NewGroceryList } from "@/types/grocery";

// Package Imports
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
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

    const groceryList: NewGroceryList = await req.json();

    const { _id, ...groceryListToInsert } = {
      ...groceryList,
      creatorId: userProfile._id,
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
