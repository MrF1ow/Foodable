import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { WebhookEvent } from "@clerk/nextjs/server";
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateUserWithoutID } from "@/lib/utils/typeValidation/user";
import { isValidObjectId } from "@/lib/utils/validation";
import { NewUser } from "@/types/user";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      "Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing Svix headers", {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error: Could not verify webhook:", err);
    return new Response("Error: Verification error", {
      status: 400,
    });
  }

  if (evt.type === "user.created") {
    // make the user in mongoDB to be used in the app
    console.log("userId:", evt.data.id);
    try {
      const user: NewUser = {
        clerkId: evt.data.id,
        username:
          evt.data.username || evt.data.email_addresses[0].email_address,
        email: evt.data.email_addresses[0].email_address,
        settings: {
          theme: "light",
        },
        imageId: null,
        preferences: {
          dietaryRestrictions: [],
          budget: 0,
          foodTypePreferences: [],
        },
        savedItems: {
          recipes: [],
          groceryLists: [],
        },
        currentGroceryList: null,
        createdRecipes: [],
        following: [],
        followers: [],
        lastLogin: new Date(),
        dateJoined: new Date(),
      };

      if (!validateUserWithoutID(user, isValidObjectId)) {
        return NextResponse.json(
          { message: HTTP_RESPONSES.BAD_REQUEST },
          { status: 400 }
        );
      }

      const db = await getDB();

      const userRecord = await db
        .collection("users")
        .findOne({ email: user.email }); // email is unique
      if (userRecord) {
        return NextResponse.json(
          { message: HTTP_RESPONSES.CONFLICT },
          { status: 409 }
        );
      }

      const result = await db.collection("users").insertOne(user);

      return NextResponse.json({ _id: result.insertedId }, { status: 201 });
    } catch (error) {
      console.error("Error creating user:", error);

      return NextResponse.json(
        { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
        { status: 500 }
      );
    }
  }

  return new Response("Webhook received", { status: 200 });
}
