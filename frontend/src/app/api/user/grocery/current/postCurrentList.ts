import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { getDB } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/utils/user";
import { isValidObjectId } from "@/lib/utils/validation";
import { currentUser } from "@clerk/nextjs/server";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userData, error, status } = await getCurrentUser<
      { _id: ObjectId, currentGroceryList: ObjectId }>({
        _id: 1,
        currentGroceryList: 1,
      });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

    const { _id } = await req.json();

    if (!isValidObjectId(_id)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const db = await getDB();
    const newGroceryListId = ObjectId.createFromHexString(_id);

    // If already set to the same ID, just return 200
    if (
      userData.currentGroceryList &&
      userData.currentGroceryList.toString() === newGroceryListId.toString()
    ) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.ALREADY_EXISTS },
        { status: 200 }
      );
    }

    const result = await db
      .collection("users")
      .updateOne(
        { _id: userData._id },
        { $set: { currentGroceryList: ObjectId.createFromHexString(_id) } }
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_MODIFIED },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: HTTP_RESPONSES.OK },
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
