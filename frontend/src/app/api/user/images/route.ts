import { POST as postImage } from "./postImage";
import { GET as getImage } from "@/app/api/images/getImage";
import { DELETE as deleteImage } from "./deleteImage";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  return postImage(request);
}

export async function GET(request: NextRequest) {
  return getImage(request);
}

export async function DELETE(request: NextRequest) {
  return deleteImage(request);
}
