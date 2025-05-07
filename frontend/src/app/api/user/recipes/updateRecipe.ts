import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/lib/utils/validation";
import { validateRecipe } from "@/lib/utils/typeValidation/recipes";
import { Recipe } from "@/types/recipe";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { formEmbeddingData, insertEmbeddings } from "@/lib/utils/embeddings";
import { ObjectId } from "mongodb";

export async function PUT(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const db = await getDB();
    const userProfile = await db.collection('users').findOne({ clerkId: clerkUser.id });

    if (!userProfile) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

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
    const userId = userProfile._id

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
        _id: userProfile._id,
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
