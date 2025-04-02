import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { getDB } from "@/lib/mongodb";
import { isValidObjectId } from "@/utils/validation";
import { currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { _id } = await req.json();

    console.log("Received _id: ", _id);

    if (!isValidObjectId(_id)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    console.log("Valid _id: ", _id);

    const db = await getDB();

    const result = await db
      .collection("users")
      .updateOne(
        { clerkId: clerkUser.id },
        { $set: { currentGroceryList: ObjectId.createFromHexString(_id) } }
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Failed to update grocery list" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Current grocery list updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating grocery list: ", error);
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
