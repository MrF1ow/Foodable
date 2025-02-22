// Local Imports
import { setupGridFS } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { getValueFromSearchParams } from "@/utils/routeHelpers";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function DELETE(req: Request) {
  try {
    const imageId = getValueFromSearchParams(req, "id");

    if (!imageId) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const { bucket } = await setupGridFS();

    const imageIdAsObjectId = new ObjectId(imageId);
    const file = await bucket.find({ _id: imageIdAsObjectId }).toArray();

    if (!file.length || file.length === 0) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    await bucket.delete(file[0]._id);

    return NextResponse.json({ message: HTTP_RESPONSES.OK }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
