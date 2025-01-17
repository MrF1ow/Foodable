// Local Imports
import { setupGridFS } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";
import { getValueFromSearchParams } from "@/utils/routeHelpers";

// Package Imports
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const sourceId = getValueFromSearchParams(req, "id");

    if (!sourceId) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const bucket = await setupGridFS();

    const file = await bucket.find({ "metadata.sourceId": sourceId }).toArray();

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
