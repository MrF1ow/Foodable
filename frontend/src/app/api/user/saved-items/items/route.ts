import { DELETE as deleteSavedItem } from "./deleteSavedItem";
import { POST as saveItem } from "./saveItem";
import { GET as getAllSavedItems } from "./getAllSavedItems";
import { PUT as updateSavedItem } from "./updateSavedItem";
import type { NextRequest } from "next/server";

export async function GET() {
  return getAllSavedItems();
}

export async function PUT(request: NextRequest) {
  return updateSavedItem(request);
}

// Handling POST request
export async function POST(request: NextRequest) {
  return saveItem(request);
}

// Handling DELETE request
export async function DELETE(request: NextRequest) {
  return deleteSavedItem(request);
}
