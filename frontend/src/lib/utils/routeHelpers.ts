import { CollectionNames } from "@/types";

export function getValueFromSearchParams(req: Request, paramName: string) {
  if (!req.url) {
    throw new Error("Request URL is undefined");
  }
  const url = new URL(req.url);
  const value = url.searchParams.get(paramName);
  if (!value) {
    return null;
  }

  return value;
}

export const getRouteParam = (param: string | string[] | undefined): string | null => {
  if (Array.isArray(param)) {
    return param[0]; // If param is an array, return the first element
  }
  return param || null; // Otherwise, return the param itself, or null if undefined
};

export const getCreatorFromImageIdLocation = (collection: CollectionNames): string => {
  let location: string = ''
  if (collection === "recipes") {
    location = "creatorId";
  } else if (collection === "users") {
    location = "_id";
  }
  return location
}