import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { isValidObjectId } from "@/lib/utils/validation";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { currentUser } from "@clerk/nextjs/server";

export async function DELETE(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { id } = await req.json();
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const db = await getDB();
    const userProfile = await db.collection('users').findOne({ clerkId: clerkUser.id });

    if (!userProfile) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    const deletedRecipe = await db
      .collection("recipes")
      .findOneAndDelete({
        _id: ObjectId.createFromHexString(id),
        creatorId: userProfile._id,
      });

    if (!deletedRecipe) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Remove the deleted ID from savedItems.recipes
    const updatedSavedLists =
      userProfile.savedItems?.recipes?.filter(
        (list: { _id: string | ObjectId }) => list._id.toString() !== id.toString()
      ) || [];

    // Apply the filtered list back to the user profile
    if (userProfile.savedItems) {
      userProfile.savedItems.recipes = updatedSavedLists;
    }

    const updateFields: Record<string, any> = {
      "savedItems.recipes": updatedSavedLists,
    };

    await db.collection("users").updateOne(
      { clerkId: clerkUser.id },
      { $set: updateFields }
    );

    await db.collection("users").updateOne(
      { _id: userProfile._id },
      { $pull: { createdRecipes: { _id: ObjectId.createFromHexString(id) } } as any }
    );

    await db.collection("vectors").deleteOne(
      { referenceId: ObjectId.createFromHexString(id) }
    )

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
