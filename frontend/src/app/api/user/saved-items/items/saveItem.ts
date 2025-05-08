import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { isValidObjectId } from "@/lib/validation/types/general";
import { currentUser } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const requestBody = await req.json(); // Parse request body

    console.log("Request body: ", requestBody); // Log the request body for debugging

    const { _id, title, category, type } = requestBody; // Parse request body metadata

    if (!_id || !title || !category || !type) {
      return NextResponse.json(
        { message: "Item Metadata is required" },
        { status: 400 }
      );
    }

    if (!isValidObjectId(_id)) {
      return NextResponse.json(
        { message: "Invalid _id" },
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

    let result; // Placeholder for the result of the update operation

    if (type === "recipe") {
      const { imageId, tags } = requestBody; // parse the rest of the request body

      if (!imageId || !tags) {
        return NextResponse.json(
          { message: "Additional Metadata is required" },
          { status: 400 }
        );
      }

      const existingRecipe = user.savedItems?.recipes?.find(
        (recipe: any) => recipe._id.toString() === _id
      );

      if (existingRecipe) {
        if (existingRecipe.category === category) {
          return NextResponse.json(
            { message: "Item is already saved in the same category" },
            { status: 400 }
          );
        }
      }

      result = await usersCollection.updateOne(
        { clerkId: clerkUser.id },
        {
          $addToSet: {
            "savedItems.recipes": {
              _id: ObjectId.createFromHexString(_id),
              title: title,
              imageId: ObjectId.createFromHexString(imageId),
              category: category,
              type: type,
            },
          },
        }
      );
    } else if (type === "groceryList") {
      const existingList = user.savedItems?.groceryLists?.find(
        (groceryList: any) => groceryList._id.toString() === _id
      );

      if (existingList) {
        if (existingList.category === category) {
          return NextResponse.json(
            { message: "Item is already saved" },
            { status: 400 }
          );
        }
      }

      result = await usersCollection.updateOne(
        { clerkId: clerkUser.id },
        {
          $addToSet: {
            "savedItems.groceryLists": {
              _id: ObjectId.createFromHexString(_id),
              title: title,
              category: category,
              type: type,
            },
          },
        }
      );
    }

    if (result && result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Failed to save item" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Item saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving item:", error);
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
