import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";
import { validateRecipeWithoutId } from "@/utils/validation";
import { NewRecipe } from "@/types";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const recipe: NewRecipe = await req.json();

    console.log("Creating Recipe:", recipe);

    const recipeToInsert: NewRecipe = {
      ...recipe,
      title: recipe.title || "",
      description: recipe.description || "",
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || [],
      userRatings: recipe.userRatings || [],
      averageRating: recipe.averageRating ?? null,
      priceApproximation: recipe.priceApproximation ?? null,
      timestamp: recipe.timestamp || new Date(),
    };

    if (!validateRecipeWithoutId(recipeToInsert)) {
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
