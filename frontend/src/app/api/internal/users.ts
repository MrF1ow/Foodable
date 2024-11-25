// Local Imports
import { getDB } from "@/lib/mongodb";
import { HTTP_RESPONSES } from "@/lib/constants";
import { validateUser, validateObject } from "@/utils/validation";
import { User } from "@/types";

// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const createUser = async (user: User) => {
  try {
    const db = await getDB();

    const validationResponse = validateObject(
      user,
      validateUser,
      HTTP_RESPONSES.BAD_REQUEST,
      400
    );

    if (validationResponse) {
      return validationResponse;
    }

    const newUser = await db.collection("users").insertOne(user);

    // Return the ID of the new user
    return NextResponse.json(newUser.insertedId, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const db = await getDB();

    const deletedUser = await db
      .collection("users")
      .findOneAndDelete({ _id: new ObjectId(userId) });

    if (!deletedUser || !deletedUser.value) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
};

export const getUserById = async (userId: string) => {
  try {
    const db = await getDB();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });

    const validationResponse = validateObject(
      user,
      validateUser,
      HTTP_RESPONSES.BAD_REQUEST,
      404
    );

    // If there is a validation response, return it because it means the user is invalid or not found
    if (validationResponse) {
      return validationResponse;
    }

    // Return user
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);

    // Return 500 if there is an error
    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
};

export const updateUser = async (userId: string, user: User) => {
  try {
    const db = await getDB();

    const inputValidationResponse = validateObject(
      user,
      validateUser,
      HTTP_RESPONSES.BAD_REQUEST,
      400
    );

    if (inputValidationResponse) {
      return inputValidationResponse;
    }

    const updatedUser = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: user },
        { returnDocument: "after" }
      );

    if (!updatedUser || !updatedUser.value) {
      return NextResponse.json(
        { message: HTTP_RESPONSES.NOT_FOUND },
        { status: 404 }
      );
    }

    const validationResponse = validateObject(
      updatedUser.value,
      validateUser,
      HTTP_RESPONSES.BAD_REQUEST,
      404
    );

    if (validationResponse) {
      return validationResponse;
    }

    return NextResponse.json(updatedUser.value, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);

    return NextResponse.json(
      { message: HTTP_RESPONSES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
};
