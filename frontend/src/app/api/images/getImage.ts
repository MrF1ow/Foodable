// Local Imports
import { setupGridFS } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { getValueFromSearchParams } from "@/lib/utils/routeHelpers";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
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

    const downloadStream = bucket.openDownloadStream(file[0]._id);

    const contentType =
      file[0].metadata?.contentType || "application/octet-stream";

    const chunks: Uint8Array[] = [];
    const reader = downloadStream;

    await new Promise((resolve, reject) => {
      reader.on("data", (chunk) => chunks.push(chunk));
      reader.on("end", resolve);
      reader.on("error", reject);
    });

    const buffer = Buffer.concat(chunks);

    const base64 = buffer.toString("base64");

    return NextResponse.json(
      {
        contentType,
        base64Image: `data:${contentType};base64,${base64}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR, error: error },
      { status: 500 }
    );
  }
}
