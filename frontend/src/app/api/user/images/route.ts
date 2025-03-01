import { POST as postImage } from "./postImage";
import { DELETE as deleteImage } from "./deleteImage";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return postImage(request);
}

export async function DELETE(request: NextRequest) {
  return deleteImage(request);
}
