import { POST as postRecipe } from "./postRecipe";
import { GET as getRecipeById } from "./getRecipeById";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return postRecipe(request);
}

export async function GET(request: NextRequest) {
  return getRecipeById(request);
}
