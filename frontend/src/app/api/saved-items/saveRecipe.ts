import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { isValidObjectId } from "@/utils/typeValidation/general";

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST_RECIPE(req: Request) {
  try {
    const { userId, itemId, itemTitle, itemImageId, itemCategory } =
      await req.json(); // Parse request body

    if (!userId || !itemId || !itemTitle || !itemImageId || !itemCategory) {
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

    const existingRecipe = user.savedItems?.recipes?.find(
      (recipe: any) => recipe._id.toString() === itemId
    );

    if (existingRecipe) {
      if (existingRecipe.category === itemCategory) {
        return NextResponse.json(
          { message: "Item is already saved in the same category" },
          { status: 400 }
        );
      }
    }

    const result = await usersCollection.updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      {
        $addToSet: {
          "savedItems.recipes": {
            _id: ObjectId.createFromHexString(itemId),
            title: itemTitle,
            imageId: ObjectId.createFromHexString(itemImageId),
            category: itemCategory,
          },
        },
      }
    );

    if (result.modifiedCount === 0) {
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
