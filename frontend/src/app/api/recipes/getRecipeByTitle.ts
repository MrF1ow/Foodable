import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/lib/utils/validation";
import { validateRecipe } from "@/lib/utils/typeValidation/recipes";
import { getValueFromSearchParams } from "@/lib/utils/routeHelpers";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const title = getValueFromSearchParams(req, "title");
    if (!title) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }
    const db = await getDB();

    const recipes = await db
      .collection("recipes")
      .find({ title: title })
      .toArray();

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
    console.error("Error getting recipe:", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
