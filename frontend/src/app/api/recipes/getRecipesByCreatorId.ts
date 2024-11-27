import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";
import { validateRecipe, validateObject } from "@/utils/validation";
import { getCreatorIdFromSearchParams } from "@/utils/routeHelpers";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    console.log("WE CREATOR HERE");
    const creatorId = getCreatorIdFromSearchParams(req);
    console.log("1");
    if (!creatorId) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }
    const db = await getDB();

    const recipes = await db
      .collection("recipes")
      .find({ _id: new ObjectId(creatorId) })
      .toArray();

    if (recipes.length === 0) {
      return NextResponse.json(
        { message: "No recipes found for this user." },
        { status: 404 }
      );
    }

    const validationResponse = validateObject(
      recipes,
      validateRecipe,
      HTTP_RESPONSES.BAD_REQUEST,
      400
    );
    console.log("2");
    if (validationResponse) {
      return validationResponse;
    }
    console.log("3");

    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.error("Error getting recipes:", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
