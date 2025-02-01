import { DELETE as deleteSavedItem } from "./deleteSavedItem";
import { POST as postSavedItem } from "./postSavedItem";
import type { NextRequest } from "next/server";

// Handling POST request
export async function POST(request: NextRequest) {
  return postSavedItem(request);
}

// Handling DELETE request
export async function DELETE(request: NextRequest) {
  return deleteSavedItem(request);
}
