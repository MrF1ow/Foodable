// Local Imports
import { setupGridFS } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";

// Package Imports
import { NextResponse } from "next/server";
import { Readable, pipeline } from "stream";
import { ObjectId } from "mongodb";
import { isValidCollectionName } from "@/lib/utils/typeValidation/general";
import { isValidObjectId } from "@/lib/utils/validation";
import { getCreatorFromImageIdLocation } from "@/lib/utils/routeHelpers";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { bucket, db } = await setupGridFS();

    const formData = await req.formData();

    const file = formData.get("image");
    const sourceId = formData.get("sourceId");
    const collectionName = formData.get("collectionName");

    if (!file || !(file instanceof Blob) || !isValidObjectId(sourceId) || !isValidCollectionName(collectionName)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const docId = sourceId?.toString()
    const creatorTag = getCreatorFromImageIdLocation(collectionName)

    const sourceDoc = await db.collection(collectionName).findOne({
      _id: ObjectId.createFromHexString(docId!)
    })

    if (!sourceDoc) {
      return NextResponse.json(
        { message: "Document Not Found" },
        { status: 404 }
      );
    }

    const creatorId = sourceDoc[creatorTag]

    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.id) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userProfile = await db.collection('users').findOne({ clerkId: clerkUser.id });

    if (creatorId.toString() !== userProfile?._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const collection = db.collection(collectionName);

    const fileStream = file.stream();

    const nodeReadableStream = new Readable();
    nodeReadableStream._read = () => { };

    // Process the file into the nodeReadableStream
    const reader = fileStream.getReader();

    function readChunk() {
      reader.read().then(({ done, value }) => {
        if (done) {
          // Push null to indicate the end of the stream
          nodeReadableStream.push(null);

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
        creatorId: userProfile?._id,
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

    if (sourceId) {
      const docId = ObjectId.createFromHexString(sourceId.toString());
      collection.updateOne(
        { _id: docId },
        { $set: { imageId: uploadStream.id } }
      );
    }

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
