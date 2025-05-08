import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/lib/validation/server-validation";
import { validateRecipe } from "@/lib/validation/types/recipes";
import { getValueFromSearchParams } from "@/lib/utils/api-helpers";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const creatorId = getValueFromSearchParams(req, "creatorId");
    if (!creatorId) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(creatorId)) {
      return NextResponse.json(
        { message: "Invalid creatorId format." },
        { status: 400 }
      );
    }

    const db = await getDB();
    console.log("creatorId:", creatorId);
    const recipes = await db
      .collection("recipes")
      .find({ creatorId: creatorId })
      .toArray();

    if (recipes.length === 0) {
      return NextResponse.json(
        { message: "No recipes found for this user." },
        { status: 404 }
      );
    }

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

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error("Error getting recipes:", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
