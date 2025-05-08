// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";
import { validateUserWithoutID } from "@/lib/validation/types/user";
import { NewUser } from "@/types/user";

// Package Imports
import { NextResponse } from "next/server";
import { isValidObjectId } from "@/lib/validation/server-validation";

export async function POST(req: Request) {
  try {
    // get the id from the request body
    const user: NewUser = await req.json();

    console.log("User:", user);

    const userToInsert: NewUser = {
      ...user,
      preferences: {
        dietaryRestrictions: user.preferences.dietaryRestrictions || [],
        budget: user.preferences.budget || 0,
        foodTypePreferences: user.preferences.foodTypePreferences || []
      },
      savedItems: {
        recipes: user.savedItems.recipes || [], // Ensure recipes is an array
        groceryLists: user.savedItems.groceryLists || [], // Ensure groceryLists is an array
      },
      currentGroceryList: user.currentGroceryList || null,
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
