import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateRecipeWithoutId } from "@/utils/typeValidation/recipes";
import { isValidObjectId } from "@/utils/validation";
import { createTagsForRecipe } from "@/utils/filterHelpers";
import { NewRecipe } from "@/types/recipe";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const recipe: NewRecipe = await req.json();

    const recipeToInsert: NewRecipe = {
      ...recipe,
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

    const db = await getDB();

    const result = await db.collection("recipes").insertOne(recipeToInsert);

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
