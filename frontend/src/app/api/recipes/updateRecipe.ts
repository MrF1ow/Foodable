import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";
import { validateRecipe, validateObject } from "@/utils/validation";
import { Recipe } from "@/types";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(req: Request) {
  try {
    const recipe: Recipe = await req.json();

    console.log("Updating Recipe");

    const preValidationResponse = validateObject(
      recipe,
      validateRecipe,
      HTTP_RESPONSES.BAD_REQUEST,
      400
    );

    if (preValidationResponse) {
      return preValidationResponse;
    }

    const { id } = recipe;

    const db = await getDB();

    const updatedRecipe = await db
      .collection("recipes")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: recipe },
        { returnDocument: "after" }
      );

    if (!updatedRecipe) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    const validationResponse = validateObject(
      updatedRecipe,
      validateRecipe,
      HTTP_RESPONSES.BAD_REQUEST,
      400
    );

    if (validationResponse) {
      return validationResponse;
    }

    return NextResponse.json(updatedRecipe, { status: 200 });
  } catch (error) {
    console.log("Error creating recipe", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
