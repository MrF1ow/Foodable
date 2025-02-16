export const isValidObjectId = (id: any): boolean => {
  const objectIdPattern = /^[a-fA-F0-9]{24}$/; // MongoDB ObjectId pattern
  return typeof id.toString() === "string" && objectIdPattern.test(id);
};

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
