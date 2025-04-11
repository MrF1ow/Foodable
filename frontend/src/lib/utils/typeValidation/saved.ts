import { SavedRecipeMetaData } from "@/types/saved";

export function validateSavedRecipeMetadata(
  item: any,
  validateIdFn: (id: any) => boolean
): item is SavedRecipeMetaData {
  return (
    item &&
    item._id &&
    item.type === "recipe" &&
    item.title &&
    item.imageId &&
    item.category
  );
}
