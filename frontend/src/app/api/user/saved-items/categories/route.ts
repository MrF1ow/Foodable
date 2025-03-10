import { DELETE as deleteCategory } from "./deleteCategory";
import { PUT as updateCategory } from "./updateCategory";
import { GET as getAllCategory } from "./getAllCategory";
import type { NextRequest } from "next/server";

export async function GET() {
  return getAllCategory();
}

export async function DELETE(request: NextRequest) {
  return deleteCategory(request);
}

export async function PUT(request: NextRequest) {
  return updateCategory(request);
}
