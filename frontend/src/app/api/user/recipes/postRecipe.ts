import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateRecipeWithoutId } from "@/lib/utils/typeValidation/recipes";
import { isValidObjectId } from "@/lib/utils/validation";
import { createTagsForRecipe } from "@/lib/utils/filterHelpers";
import { NewRecipe } from "@/types/recipe";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { formEmbeddingData, insertEmbeddings } from "@/lib/utils/embeddings";
import { getCurrentUser } from "@/lib/utils/user";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { userData, error, status } = await getCurrentUser<
      { _id: ObjectId }>({
        _id: 1,
      });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

    const db = await getDB();

    const recipe: NewRecipe = await req.json();

    const recipeToInsert: NewRecipe = {
      ...recipe,
      creatorId: userData._id,
      title: recipe.title || "",
      description: recipe.description || "",
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      userRatings: recipe.userRatings || [],
      averageRating: recipe.averageRating || 0,
      priceApproximation: recipe.priceApproximation,
      timestamp: recipe.timestamp || new Date(),
    };

    const tags = createTagsForRecipe(
      recipeToInsert.timeApproximation,
      recipeToInsert.ingredients,
      recipeToInsert.priceApproximation
    );

    recipeToInsert.tags = tags;

    if (!validateRecipeWithoutId(recipeToInsert, isValidObjectId)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const result = await db.collection("recipes").insertOne(recipeToInsert);

    const metaData = {
      _id: result.insertedId,
      title: recipeToInsert.title,
      imageId: recipeToInsert.imageId,
      category: "My Recipes",
      type: "recipe"
    }

    const embeddingData = formEmbeddingData("recipe", recipeToInsert, result.insertedId)

    await db.collection("users").updateOne({
      _id: userData._id
    },
      { $addToSet: { createdRecipes: metaData } })

    await insertEmbeddings([embeddingData])

    return NextResponse.json(
      { ...recipeToInsert, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error creating recipe", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
