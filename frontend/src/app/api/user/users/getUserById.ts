// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateObject } from "@/lib/utils/validation";
import { validateUser } from "@/lib/utils/typeValidation/user";
import { getValueFromSearchParams } from "@/lib/utils/routeHelpers";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const id = getValueFromSearchParams(req, "id");

    if (!id) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }
    const db = await getDB();

    const user = await db
      .collection("users")
      .findOne({ _id: ObjectId.createFromHexString(id) });

    const validationResponse = validateObject(
      user,
      validateUser,
      HTTP_RESPONSES.BAD_REQUEST,
      400
    );
    if (validationResponse) {
      return validationResponse;
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error getting user:", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
