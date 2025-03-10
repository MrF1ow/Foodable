import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { currentUser } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json(
        { message: "User ID Not Provided" },
        { status: 404 }
      );
    }

    const requestBody = await req.json();

    const { _id, category, type } = requestBody;

    if (!_id || !category || !type) {
      return NextResponse.json(
        { message: "itemId is required" },
        { status: 400 }
      );
    }

    const db = await getDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne(
      { clerkId: clerkUser.id },
      { projection: { savedItems: 1 } }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Array to store the items
    let arr = [];

    if (type === "recipe") {
      arr = user.savedItems?.recipes;
    } else if (type === "groceryList") {
      arr = user.savedItems?.groceryLists;
    }

    const updatedArr = arr.filter(
      (item: any) => item._id.toString() !== _id || item.category !== category
    );

    if (updatedArr.length === arr.length) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    let result;
    if (type === "recipe") {
      result = await usersCollection.updateOne(
        { clerkId: clerkUser.id },
        {
          $set: {
            "savedItems.recipes": updatedArr,
          },
        }
      );
    } else if (type === "groceryList") {
      result = await usersCollection.updateOne(
        { clerkId: clerkUser.id },
        {
          $set: {
            "savedItems.groceryLists": updatedArr,
          },
        }
      );
    }

    if (result && result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Item not found or user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Item removed from savedItems successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing item:", error);
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
