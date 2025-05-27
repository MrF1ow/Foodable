import { SavedRecipeMetaData } from "@/types/saved";

export function validateSavedRecipeMetadata(
  item: any,
  validateIdFn: (id: any) => boolean
): item is SavedRecipeMetaData {
  return !!(
    item &&
    validateIdFn(item._id) &&
    item.type === "recipe" &&
    typeof item.title === "string" &&
    validateIdFn(item.imageId) &&
    typeof item.category === "string"
  );
}
