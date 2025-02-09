import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { isValidObjectId } from "@/utils/typeValidation/general";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(req: Request, type: "recipe" | "groceryList") {
  try {
    const { userId, itemId, itemCategory } = await req.json();

    if (!userId || !itemId || !itemCategory) {
      return NextResponse.json(
        { message: "userId and itemId are required" },
        { status: 400 }
      );
    }

    if (!isValidObjectId(userId) || !isValidObjectId(itemId)) {
      return NextResponse.json(
        { message: "Invalid userId or itemId" },
        { status: 400 }
      );
    }

    const db = await getDB();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne(
      { _id: ObjectId.createFromHexString(userId) },
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
      (item: any) =>
        item._id.toString() !== itemId || item.category !== itemCategory
    );

    if (updatedArr.length === arr.length) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    let result;
    if (type === "recipe") {
      result = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            "savedItems.recipes": updatedArr,
          },
        }
      );
    } else if (type === "groceryList") {
      result = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
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
