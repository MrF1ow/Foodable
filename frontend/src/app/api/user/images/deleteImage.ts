// Local Imports
import { getDB, setupGridFS } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { isValidCollectionName } from "@/lib/utils/typeValidation/general";
import { currentUser } from "@clerk/nextjs/server";
import { getCurrentUser } from "@/lib/utils/user";

export async function DELETE(req: Request) {
  try {
    const { userData, error, status } = await getCurrentUser<
      { _id: ObjectId }>({
        _id: 1,
      });

    if (!userData) {
      return NextResponse.json({ message: error }, { status });
    }

    const { imageId, collectionName } = await req.json()

    if (!imageId || !isValidCollectionName(collectionName)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const { bucket, db } = await setupGridFS();

    const imageIdAsObjectId = ObjectId.createFromHexString(imageId);
    const file = await bucket.find({ _id: imageIdAsObjectId }).toArray();

    if (!file.length || file.length === 0) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    if (file[0].metadata?.creatorId.toString() !== userData._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const sourceId = file[0].metadata?.sourceId;

    await bucket.delete(file[0]._id);

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
