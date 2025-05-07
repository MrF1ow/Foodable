// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { currentUser } from "@clerk/nextjs/server";

// Package Imports
import { NextResponse } from "next/server";
import { formEmbeddingData, insertEmbeddings } from "@/lib/utils/embeddings";
import { getCurrentUser } from "@/lib/utils/user";
import { ObjectId } from "mongodb";

export async function PUT(req: Request) {
  try {
    const { userData, error, status } = await getCurrentUser<{ _id: ObjectId }>({ _id: 1 });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

    const db = await getDB();

    const { preferences } = await req.json();

    if (!preferences) {
      return NextResponse.json(
        { message: "Invalid data: preferences are required" },
        { status: 400 }
      );
    }

    const result = await db.collection("users").updateOne(
      { _id: userData._id },
      {
        $set: {
          preferences: preferences,
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "User update failed" },
        { status: 400 }
      );
    }

    const embeddingData = formEmbeddingData("preferences", preferences, userData._id)

    await insertEmbeddings([embeddingData])

    return NextResponse.json(
      { message: "User preferences updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user preferences: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
