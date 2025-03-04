export const isValidObjectId = (id: any): boolean => {
  const objectIdPattern = /^[a-fA-F0-9]{24}$/; // MongoDB ObjectId pattern
  return typeof id.toString() === "string" && objectIdPattern.test(id);
};

export function isValidUserId(id: string): boolean {
  if (!id) {
    return false;
  }
  if (typeof id !== "string") {
    return false;
  }
  const userIdPattern = /^user_[A-Za-z0-9]{27}$/;
  return userIdPattern.test(id);
}

export const isValidStringArray = (arr: any): boolean =>
  Array.isArray(arr) &&
  (arr.length === 0 || arr.every((item) => typeof item === "string"));

export const isValidDate = (value: any): boolean => {
  if (value instanceof Date && !isNaN(value.getTime())) {
    return true;
  }
  if (typeof value === "string") {
    const date = new Date(value);
    console.log("bad date");
    return !isNaN(date.getTime());
  }
  console.log("bad date");
  return false;
};
