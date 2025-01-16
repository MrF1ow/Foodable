// Local Imports
import { setupGridFS } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";

// Package Imports
import { NextResponse } from "next/server";
import { Readable, pipeline } from "stream";

export async function POST(req: Request) {
  try {
    const bucket = await setupGridFS();

    const formData = await req.formData();

    const file = formData.get("image");
    const sourceId = formData.get("sourceId");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const fileStream = file.stream();

    const nodeReadableStream = new Readable();
    nodeReadableStream._read = () => {};

    // Process the file into the nodeReadableStream
    const reader = fileStream.getReader();
    function readChunk() {
      reader.read().then(({ done, value }) => {
        if (done) {
          nodeReadableStream.push(null); // Push null to indicate the end of the stream
          return;
        }
        nodeReadableStream.push(value); // Push each chunk into the stream
        readChunk(); // Continue reading the next chunk
      });
    }

    readChunk(); // Start reading the chunks

    const existingFiles = await bucket
      .find({ "metadata.sourceId": sourceId })
      .toArray();

    if (existingFiles.length > 0) {
      await bucket.delete(existingFiles[0]._id); // Delete the existing image
    }

    // Create an upload stream for GridFS
    const uploadStream = bucket.openUploadStream(file.name, {
      metadata: {
        sourceId: sourceId,
        contentType: file.type,
      },
    });

    // Use pipeline to pipe the data into GridFS
    pipeline(nodeReadableStream, uploadStream, (err) => {
      if (err) {
        console.error("Pipeline error:", err);
        return NextResponse.json(
          { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
          { status: 500 }
        );
      }
      console.log("Upload complete:", uploadStream.id);
    });

    return NextResponse.json(
      { _id: uploadStream.id, message: "Image Uploaded Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading image: ", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
