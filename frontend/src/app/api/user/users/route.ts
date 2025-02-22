import { GET as getUserById } from "./getUserById";
import { POST as postUser } from "./postUser";
import { PUT as updateUser } from "./updateUser";
import { DELETE as deleteUser } from "./deleteUser";
import type { NextRequest } from "next/server";

// Handling GET request
export async function GET(request: NextRequest) {
  return getUserById(request);
}

// Handling POST request
export async function POST(request: NextRequest) {
  return postUser(request);
}

// Handling PUT request
export async function PUT(request: NextRequest) {
  return updateUser(request);
}

// Handling DELETE request
export async function DELETE(request: NextRequest) {
  return deleteUser(request);
}
