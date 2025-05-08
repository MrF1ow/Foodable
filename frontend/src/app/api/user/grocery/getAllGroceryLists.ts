// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/lib/validation/server-validation";
import { validateGroceryList } from "@/lib/validation/types/grocery";
import { getValueFromSearchParams } from "@/lib/utils/api-helpers";

// Package Imports
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/utils/user";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const { userData, error, status } = await getCurrentUser<
      { _id: ObjectId }>({
        _id: 1,
      });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

    const db = await getDB();

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
      .find({ creatorId: userData._id }, { projection })
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
