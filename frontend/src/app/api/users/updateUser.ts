// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";
import {
  validateUser,
  validateObject,
  isValidObjectId,
} from "@/utils/validation";
import { User } from "@/types";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(req: Request) {
  try {
    const user: User = await req.json();
    const { id } = user;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    if (!validateUser(user)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const db = await getDB();

    const userRecord = await db
      .collection("users")
      .findOne({ _id: new ObjectId(id) });
    if (!userRecord) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    const updatedUser = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: user },
        { returnDocument: "after" }
      );

    if (!updatedUser || !updatedUser.value) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    const validationResponse = validateObject(
      updatedUser.value,
      validateUser,
      HTTP_RESPONSES.BAD_REQUEST,
      404
    );

    if (validationResponse) {
      return validationResponse;
    }

    return NextResponse.json(updatedUser.value, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
