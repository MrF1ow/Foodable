import { POST as postRecipe } from "./postRecipe";
import { PUT as updateRecipe } from "./updateRecipe";
import { DELETE as deleteRecipe } from "./deleteRecipe";

export async function POST(request: Request) {
  return postRecipe(request);
}

export async function PUT(request: Request) {
  return updateRecipe(request);
}

export async function DELETE(request: Request) {
  return deleteRecipe(request);
}