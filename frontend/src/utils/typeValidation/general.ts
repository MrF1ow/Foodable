export const isValidObjectId = (id: any): boolean => {
  const objectIdPattern = /^[a-fA-F0-9]{24}$/; // MongoDB ObjectId pattern
  return typeof id.toString() === "string" && objectIdPattern.test(id);
};

export const isValidStringArray = (arr: any): boolean =>
  Array.isArray(arr) &&
  (arr.length === 0 || arr.every((item) => typeof item === "string"));
