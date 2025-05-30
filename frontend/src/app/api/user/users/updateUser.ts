// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/lib/validation/server-validation";
import { validateUser } from "@/lib/validation/types/user";
import { User } from "@/types/user";

// Package Imports
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const user: User = await req.json();

    const preValidationResponse = validateObject(
      user,
      validateUser,
      HTTP_RESPONSES.BAD_REQUEST,
      400
    );

    if (preValidationResponse) {
      return preValidationResponse;
    }

    const { _id, ...userWithoutID } = user;

    const db = await getDB();

    const updatedUser = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: _id },
        { $set: userWithoutID },
        { returnDocument: "after" }
      );

    if (!updatedUser) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    const validationResponse = validateObject(
      updatedUser,
      validateUser,
      HTTP_RESPONSES.BAD_REQUEST,
      404
    );

    if (validationResponse) {
      return validationResponse;
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
