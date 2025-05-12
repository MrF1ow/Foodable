// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateGroceryListWithoutId } from "@/lib/validation/types/grocery";
import { isValidObjectId } from "@/lib/validation/server-validation";
import { NewGroceryList } from "@/types/grocery";

// Package Imports
import { NextResponse } from "next/server";
import { formEmbeddingData, insertEmbeddings } from "@/lib/utils/embeddings";
import { getCurrentUser } from "@/lib/utils/user";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const { userData, error, status } = await getCurrentUser<
      { _id: ObjectId }>({
        _id: 1,
      });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

    const db = await getDB();

    const groceryList: NewGroceryList = await req.json();

    const { _id, ...groceryListToInsert } = {
      ...groceryList,
      creatorId: userData._id,
      title: groceryList.title,
      items: groceryList.items || [],
      timestamp: groceryList.timestamp || new Date(),
    };

    if (!validateGroceryListWithoutId(groceryListToInsert, isValidObjectId)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const result = await db
      .collection("groceryLists")
      .insertOne(groceryListToInsert);

    const insertedGroceryList = await db
      .collection("groceryLists")
      .findOne({ _id: result.insertedId });

    const embeddingData = formEmbeddingData("grocery", groceryListToInsert, result.insertedId)

    await insertEmbeddings([embeddingData]);

    // return the entire grocery list
    return NextResponse.json(insertedGroceryList, { status: 201 });
  } catch (error) {
    console.error("Error creating grocery list: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
