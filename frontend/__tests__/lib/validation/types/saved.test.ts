import { validateSavedRecipeMetadata } from "@/lib/validation/types/saved";
import { SavedRecipeMetaData } from "@/types/saved";

const validateIdFn = (id: any) => id === "validId";

const validSavedRecipe: SavedRecipeMetaData = {
  _id: "validId",
  type: "recipe",
  title: "My Favorite Pasta",
  imageId: "validId",
  category: "Dinner",
};

describe("validateSavedRecipeMetadata", () => {
  it("returns true for valid saved recipe metadata", () => {
    expect(validateSavedRecipeMetadata(validSavedRecipe, validateIdFn)).toBe(true);
  });

  it("returns false if _id is missing", () => {
    const invalid = { ...validSavedRecipe };
    delete (invalid as any)._id;
    expect(validateSavedRecipeMetadata(invalid, validateIdFn)).toBe(false);
  });

  it("returns false if type is not 'recipe'", () => {
    const invalid = { ...validSavedRecipe, type: "not-a-recipe" };
    expect(validateSavedRecipeMetadata(invalid, validateIdFn)).toBe(false);
  });

  it("returns false if title is missing", () => {
    const invalid = { ...validSavedRecipe };
    delete (invalid as any).title;
    expect(validateSavedRecipeMetadata(invalid, validateIdFn)).toBe(false);
  });

  it("returns false if imageId is missing", () => {
    const invalid = { ...validSavedRecipe };
    delete (invalid as any).imageId;
    expect(validateSavedRecipeMetadata(invalid, validateIdFn)).toBe(false);
  });

  it("returns false if category is missing", () => {
    const invalid = { ...validSavedRecipe };
    delete (invalid as any).category;
    expect(validateSavedRecipeMetadata(invalid, validateIdFn)).toBe(false);
  });

  it("returns false for null input", () => {
    expect(validateSavedRecipeMetadata(null, validateIdFn)).toBe(false);
  });

  it("returns false for undefined input", () => {
    expect(validateSavedRecipeMetadata(undefined, validateIdFn)).toBe(false);
  });
});

