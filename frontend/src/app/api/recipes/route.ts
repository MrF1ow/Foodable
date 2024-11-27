import { POST as postRecipe } from "./postRecipe";
import { GET as getRecipeById } from "./getRecipeById";
import { PUT as updateRecipe } from "./updateRecipe";
import { DELETE as deleteRecipe } from "./deleteRecipe";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return postRecipe(request);
}

export async function GET(request: NextRequest) {
  return getRecipeById(request);
}

export async function PUT(request: NextRequest) {
  return updateRecipe(request);
}

export async function DELETE(request: NextRequest) {
  return deleteRecipe(request);
}
