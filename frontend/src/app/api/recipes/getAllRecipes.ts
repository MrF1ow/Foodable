import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/utils/validation";
import { validateRecipe } from "@/utils/typeValidation/recipes";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDB();

    const recipes = await db.collection("recipes").find().toArray();

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
