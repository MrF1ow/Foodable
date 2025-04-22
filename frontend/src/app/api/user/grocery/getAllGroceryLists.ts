// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/lib/utils/validation";
import { validateGroceryList } from "@/lib/utils/typeValidation/grocery";
import { getValueFromSearchParams } from "@/lib/utils/routeHelpers";
import { currentUser } from "@clerk/nextjs/server";

// Package Imports
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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


    const fetchMetadata = getValueFromSearchParams(req, "metadata") === "true";

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
      .find({ creatorId: userProfile._id }, { projection })
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
