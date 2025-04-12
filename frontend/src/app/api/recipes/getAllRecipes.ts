import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/lib/utils/validation";
import { validateRecipe } from "@/lib/utils/typeValidation/recipes";

import { NextResponse } from "next/server";
import { getValueFromSearchParams } from "@/lib/utils/routeHelpers";

export async function GET(req: Request) {
  try {
    const fetchMetadata = getValueFromSearchParams(req, "metadata") === "true";

    const db = await getDB();

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

    const recipes = await db
      .collection("recipes")
      .find({}, { projection })
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
