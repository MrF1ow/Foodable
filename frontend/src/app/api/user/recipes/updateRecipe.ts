import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/lib/validation/server-validation";
import { validateRecipe } from "@/lib/validation/types/recipes";
import { Recipe } from "@/types/recipe";

import { NextResponse } from "next/server";
import { formEmbeddingData, insertEmbeddings } from "@/lib/utils/embeddings";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/utils/user";

export async function PUT(req: Request) {
  try {
    const { userData, error, status } = await getCurrentUser<
      { _id: ObjectId }>({
        _id: 1,
      });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

    const db = await getDB();

    const recipe: Recipe = await req.json();

    const preValidationResponse = validateObject(
      recipe,
      validateRecipe,
      HTTP_RESPONSES.BAD_REQUEST,
      400
    );

    if (preValidationResponse) {
      return preValidationResponse;
    }

    const { _id, creatorId, ...recipeWithoutID } = recipe;

    const recipeId = ObjectId.createFromHexString(_id.toString());
    const userId = userData._id

    const updatedRecipe = await db
      .collection("recipes")
      .findOneAndUpdate(
        { _id: recipeId, creatorId: userId },
        { $set: recipeWithoutID },
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
      404
    );

    if (validationResponse) {
      return validationResponse;
    }

    await db.collection('users').updateOne(
      {
        _id: userData._id,
        "createdRecipes._id": _id
      },
      {
        $set: {
          "createdRecipes.$.title": recipeWithoutID.title,
          "createdRecipes.$.imageId": recipeWithoutID.imageId
        }
      }
    );

    const embeddingData = formEmbeddingData("recipe", recipe, ObjectId.createFromHexString(_id.toString()))


    await insertEmbeddings([embeddingData])

    return NextResponse.json(updatedRecipe, { status: 200 });
  } catch (error) {
    console.log("Error updating recipe", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
