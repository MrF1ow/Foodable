
import { GET as getRecipeById } from "./getRecipeById";
import { GET as getRecipesByCreatorId } from "./getRecipesByCreatorId";
import { GET as getAllRecipes } from "./getAllRecipes";
import { GET as getRecipeByTitle } from "./getRecipeByTitle";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  if (searchParams.has("creatorId")) {
    return getRecipesByCreatorId(request);
  } else if (searchParams.has("id")) {
    return getRecipeById(request);
  } else if (searchParams.has("title")) {
    return getRecipeByTitle(request);
  } else {
    return getAllRecipes(request);
  }
}
