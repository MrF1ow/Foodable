import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/lib/validation/server-validation";
import { validateRecipe } from "@/lib/validation/types/recipes";
import { getValueFromSearchParams } from "@/lib/utils/api-helpers";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const id = getValueFromSearchParams(req, "id");

    if (!id) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }
    const db = await getDB();

    const recipe = await db
      .collection("recipes")
      .findOne({ _id: new ObjectId(id) });

    if (!recipe) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

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
