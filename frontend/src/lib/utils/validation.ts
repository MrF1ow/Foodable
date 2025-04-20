// Package Imports
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Local imports
import { HTTP_RESPONSES } from "@/lib/constants/httpResponses";

// Function to check if an ID is valid
export const isValidObjectId = (id: any): boolean => {
  return (
    id instanceof ObjectId || // Check if it's already an ObjectId
    (typeof id === "string" && ObjectId.isValid(id) && id.length === 24)
  );
};

export const validateObject = <T>(
  obj: any, // this is the object to validate
  validateFn: (obj: any, validateId: (id: any) => boolean) => obj is T, // this is the function that will validate the object
  errorMessage: string, // this is the error message to return if the object is invalid
  errorStatus: number // this is the status code to return if the object is invalid
): NextResponse | null => {
  // Check if the object exists
  console.log("Validating object:", obj);
  if (!obj) {
    return NextResponse.json(
      { message: errorMessage },
      { status: errorStatus }
    );
  }
  console.log("Validating object structure");
  // Validate the object structure
  if (!validateFn(obj, isValidObjectId)) {
    console.log("Invalid object structure:", obj);
    return NextResponse.json(
      { message: HTTP_RESPONSES.BAD_REQUEST },
      { status: 400 }
    );
  }

  return null; // Return null if validation passes
};
