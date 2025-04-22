import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateRecipeWithoutId } from "@/lib/utils/typeValidation/recipes";
import { isValidObjectId } from "@/lib/utils/validation";
import { createTagsForRecipe } from "@/lib/utils/filterHelpers";
import { NewRecipe } from "@/types/recipe";

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const db = await getDB()

    const userProfile = await db.collection('users').findOne({ clerkId: clerkUser.id });

    if (!userProfile) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    const recipe: NewRecipe = await req.json();

    const recipeToInsert: NewRecipe = {
      ...recipe,
      creatorId: userProfile._id,
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
