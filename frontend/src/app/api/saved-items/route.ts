import { DELETE as deleteSavedItem } from "./deleteSavedItem";
import { POST_RECIPE as saveRecipe } from "./saveRecipe";
import { POST_GROCERYLIST as saveGroceryList } from "./saveGroceryList";
import { GET as getAllSavedItems } from "./getAllSavedItems";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return getAllSavedItems(request);
}

// Handling POST request
export async function POST(request: NextRequest, type: string) {
  if (type === "recipe") {
    return saveRecipe(request);
  } else if (type === "groceryList") {
    return saveGroceryList(request);
  } else {
    return "Invalid type";
  }
}

// Handling DELETE request
export async function DELETE(
  request: NextRequest,
  type: "recipe" | "groceryList"
) {
  return deleteSavedItem(request, type);
}
