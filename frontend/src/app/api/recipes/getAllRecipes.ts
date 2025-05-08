import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/lib/validation/server-validation";
import { validateRecipe } from "@/lib/validation/types/recipes";

import { NextResponse } from "next/server";
import { getValueFromSearchParams } from "@/lib/utils/api-helpers";
import { currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const fetchMetadata = getValueFromSearchParams(req, "metadata") === "true";

    const clerkUser = await currentUser();
    const db = await getDB();

    let userId: ObjectId | null = null;

    if (clerkUser && clerkUser.id) {
      const userProfile = await db.collection('users').findOne({ clerkId: clerkUser.id });
      if (userProfile) {
        userId = userProfile._id;
      }
    }

    const projection = fetchMetadata
      ? {
        type: "recipe",
        _id: 1,
        title: 1,
        category: 1,
        imageId: 1,
        "tags.time": 1,
        "tags.price": 1,
        "tags.ingredient": 1,
      }
      : {};

    const query = userId ? { creatorId: { $ne: userId } } : {};

    const recipes = await db
      .collection("recipes")
      .find(query, { projection })
      .toArray();

    if (!fetchMetadata) {
      for (const recipe of recipes) {
        const validationResponse = validateObject(
          recipe,
          validateRecipe,
          HTTP_RESPONSES.BAD_REQUEST,
          400
        );
        if (validationResponse) {
          return validationResponse;
        }
      }
    }

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error("Error getting recipe:", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
