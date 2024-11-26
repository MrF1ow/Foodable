// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";
import { validateUser, validateObject } from "@/utils/validation";
import { User } from "@/types";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const user: User = await req.json();

    if (!validateUser(user)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const db = await getDB();

    const userRecord = await db
      .collection("users")
      .findOne({ _id: new ObjectId(user.id) });
    if (userRecord) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.CONFLICT },
        { status: 409 }
      );
    }

    const newUser = await db.collection("users").insertOne(user);

    return NextResponse.json(newUser.insertedId, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
