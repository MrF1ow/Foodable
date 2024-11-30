import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }
    const db = await getDB();

    const deletedGroceryList = await db
      .collection("groceryLists")
      .findOneAndDelete({ _id: new ObjectId(id) });

    if (!deletedGroceryList || !deletedGroceryList.value) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Grocery list deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting grocery list: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
