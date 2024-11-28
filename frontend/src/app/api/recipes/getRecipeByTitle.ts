import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";
import { validateRecipe, validateObject } from "@/utils/validation";
import { getRecipeTitleFromSearchParams } from "@/utils/routeHelpers";

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const title = getRecipeTitleFromSearchParams(req);
    console.log("Title: ", title);
    console.log("Request: ", req);

    if (!title) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }
    const db = await getDB();

    const recipe = await db.collection("recipes").findOne({ title: title });

    const validationResponse = validateObject(
      recipe,
      validateRecipe,
      HTTP_RESPONSES.BAD_REQUEST,
      400
    );

    if (validationResponse) {
      return validationResponse;
    }

    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.error("Error getting recipe:", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
