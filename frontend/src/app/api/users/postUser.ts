// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateUserWithoutID } from "@/utils/typeValidation/user";
import { isValidObjectId } from "@/utils/validation";
import { NewUser } from "@/types/user";

// Package Imports
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user: NewUser = await req.json();

    const userToInsert: NewUser = {
      ...user,
      preferences: {
        dietaryRestrictions: user.preferences.dietaryRestrictions || [],
        allergies: user.preferences.allergies || [],
      },
      savedItems: {
        recipes: user.savedItems.recipes || [], // Ensure recipes is an array
        groceryLists: user.savedItems.groceryLists || [], // Ensure groceryLists is an array
      },
      createdRecipes: user.createdRecipes || [],
      following: user.following || [],
      followers: user.followers || [],
      lastLogin: user.lastLogin || new Date(),
      dateJoined: user.dateJoined || new Date(),
    };

    if (!validateUserWithoutID(userToInsert, isValidObjectId)) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.BAD_REQUEST },
        { status: 400 }
      );
    }

    const db = await getDB();

    const userRecord = await db
      .collection("users")
      .findOne({ email: userToInsert.email }); // email is unique
    if (userRecord) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.CONFLICT },
        { status: 409 }
      );
    }

    const result = await db.collection("users").insertOne(userToInsert);

    return NextResponse.json({ _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}
