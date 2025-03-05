import { DELETE as deleteSavedItem } from "./deleteSavedItem";
import { POST as saveItem } from "./saveItem";
import { GET as getAllSavedItems } from "./getAllSavedItems";
import type { NextRequest } from "next/server";

export async function GET() {
  return getAllSavedItems();
}

// Handling POST request
export async function POST(request: NextRequest) {
  saveItem(request);
}

// Handling DELETE request
export async function DELETE(request: NextRequest) {
  return deleteSavedItem(request);
}
