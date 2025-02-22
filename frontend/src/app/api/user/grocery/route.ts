import { GET as getGroceryListById } from "./getGroceryListById";
import { GET as getGroceryLists } from "./getAllGroceryLists";
import { POST as postGroceryList } from "./postGroceryList";
import { PUT as updateGroceryList } from "./updateGroceryList";
import { DELETE as deleteGroceryList } from "./deleteGroceryList";
import type { NextRequest } from "next/server";

// Handling GET request
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    return getGroceryListById(request);
  }

  return getGroceryLists(request);
}

// Handling POST request
export async function POST(request: NextRequest) {
  return postGroceryList(request);
}

// Handling PUT request
export async function PUT(request: NextRequest) {
  return updateGroceryList(request);
}

// Handling DELETE request
export async function DELETE(request: NextRequest) {
  return deleteGroceryList(request);
}
