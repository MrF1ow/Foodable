import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { isValidObjectId } from "@/lib/validation/server-validation";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { deleteVectorEmbedding } from "@/lib/utils/embeddings";
import { getCurrentUser } from "@/lib/utils/user";

export async function DELETE(req: Request) {
  try {
    const { userData, error, status } = await getCurrentUser<
      { _id: ObjectId, savedItems: any }>({
        _id: 1,
        savedItems: 1
      });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

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
      .findOneAndDelete({
        _id: ObjectId.createFromHexString(id),
        creatorId: userData._id,
      });

    if (!deletedRecipe) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    // Remove the deleted ID from savedItems.recipes
    const updatedSavedLists =
      userData.savedItems?.recipes?.filter(
        (list: { _id: string | ObjectId }) => list._id.toString() !== id.toString()
      ) || [];

    // Apply the filtered list back to the user profile
    if (userData.savedItems) {
      userData.savedItems.recipes = updatedSavedLists;
    }

    const updateFields: Record<string, any> = {
      "savedItems.recipes": updatedSavedLists,
    };

    await db.collection("users").updateOne(
      { _id: userData._id },
      {
        $set: updateFields,
        $pull: { createdItems: { _id: ObjectId.createFromHexString(id) } } as any
      },
    );

    await deleteVectorEmbedding(ObjectId.createFromHexString(id));

    return NextResponse.json(
      { message: HTTP_RESPONSES.OK },
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
