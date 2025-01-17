// Local Imports
import { setupGridFS } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";
import { getValueFromSearchParams } from "@/utils/routeHelpers";

// Package Imports
import { NextResponse } from "next/server";

export async function GET(req: Request) {
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

    // const readableStream = new ReadableStream({
    //   start(controller) {
    //     downloadStream.on("data", (chunk) => controller.enqueue(chunk));
    //     downloadStream.on("end", () => controller.close());
    //     downloadStream.on("error", (err) => controller.error(err));
    //   },
    // });

    return NextResponse.json(
      {
        contentType,
        base64Image: `data:${contentType};base64,${base64}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
