// Local Imports
import { getDB, setupGridFS } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { isValidCollectionName } from "@/lib/utils/typeValidation/general";

export async function DELETE(req: Request) {
  try {
    const { imageId, collectionName } = await req.json()

    console.log(imageId)
    console.log(collectionName)

    if (!imageId || !isValidCollectionName(collectionName)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const { bucket } = await setupGridFS();

    const imageIdAsObjectId = ObjectId.createFromHexString(imageId);
    const file = await bucket.find({ _id: imageIdAsObjectId }).toArray();

    if (!file.length || file.length === 0) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    const sourceId = file[0].metadata?.sourceId;

    await bucket.delete(file[0]._id);

    const db = await getDB();

    await db.collection(collectionName).updateOne({
      _id: ObjectId.createFromHexString(sourceId)
    }, {
      $set: {
        imageId: null,
      }
    })

    return NextResponse.json({ message: HTTP_RESPONSES.OK }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
