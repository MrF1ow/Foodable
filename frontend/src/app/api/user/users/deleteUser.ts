import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { isValidObjectId } from "@/lib/validation/types/general";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }
    const db = await getDB();

    const deletedUser = await db
      .collection("users")
      .findOneAndDelete({ _id: ObjectId.createFromHexString(id) });

    if (!deletedUser) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
