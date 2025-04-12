import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { isValidObjectId } from "@/utils/validation";
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

    const deletedRecipe = await db
      .collection("recipes")
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!deletedRecipe) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Recipe Deleted", id: id },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error deleting recipe", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
