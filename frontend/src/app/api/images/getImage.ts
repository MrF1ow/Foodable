// Local Imports
import { setupGridFS } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";

// Package Imports
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sourceId = url.searchParams.get("id");

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

    const readableStream = new ReadableStream({
      start(controller) {
        downloadStream.on("data", (chunk) => controller.enqueue(chunk));
        downloadStream.on("end", () => controller.close());
        downloadStream.on("error", (err) => controller.error(err));
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
