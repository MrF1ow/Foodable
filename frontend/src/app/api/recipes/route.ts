import { POST as postRecipe } from "./postRecipe";
import { GET as getRecipeById } from "./getRecipeById";
import { PUT as updateRecipe } from "./updateRecipe";
import { DELETE as deleteRecipe } from "./deleteRecipe";
import { GET as getRecipesByCreatorId } from "./getRecipesByCreatorId";
import { GET as getAllRecipes } from "./getAllRecipes";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return postRecipe(request);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  if (searchParams.has("creatorId")) {
    return getRecipesByCreatorId(request);
  } else if (searchParams.has("id")) {
    return getRecipeById(request);
  } else {
    return getAllRecipes();
  }
}

export async function PUT(request: NextRequest) {
  return updateRecipe(request);
}

export async function DELETE(request: NextRequest) {
  return deleteRecipe(request);
}
