import {
  validateRecipeIngredient,
  validateRecipeWithoutId,
  validateRecipe,
} from "@/lib/validation/types/recipes";
import { unitOptions } from "@/config/unit-conversions";
import { grocerySectionOptions } from "@/config/grocery-sections";
import { NewRecipe, RecipeIngredient, Recipe } from "@/types/recipe";

// Mock validateIdFn
const validateIdFn = (id: any) => id === "validId";

// Create a valid RecipeIngredient
const validIngredient: RecipeIngredient = {
  name: "Carrot",
  quantity: 1,
  unit: Object.values(unitOptions)[0],
  category: Object.values(grocerySectionOptions)[0],
};

// Create a valid NewRecipe
const validNewRecipe: NewRecipe = {
  creatorId: "validId",
  title: "Test Recipe",
  description: "This is a test recipe.",
  ingredients: [validIngredient],
  instructions: ["Step 1", "Step 2"],
  userRatings: [],
  averageRating: 4.5,
  priceApproximation: 10.0,
};

// Create a valid Recipe (with id)
const validRecipe: Recipe = {
  ...validNewRecipe,
  id: "validId",
};

describe("validateRecipeIngredient", () => {
  it("should return true for a valid ingredient", () => {
    expect(validateRecipeIngredient(validIngredient)).toBe(true);
  });

  it("should return false for an invalid ingredient (missing name)", () => {
    const invalid = { ...validIngredient, name: 123 };
    expect(validateRecipeIngredient(invalid)).toBe(false);
  });

  it("should return false for an invalid ingredient (invalid unit)", () => {
    const invalid = { ...validIngredient, unit: "invalid_unit" };
    expect(validateRecipeIngredient(invalid)).toBe(false);
  });
});

describe("validateRecipeWithoutId", () => {
  it("should return true for a valid new recipe", () => {
    expect(validateRecipeWithoutId(validNewRecipe, validateIdFn)).toBe(true);
  });

  it("should return false if creatorId is invalid", () => {
    const invalid = { ...validNewRecipe, creatorId: "badId" };
    expect(validateRecipeWithoutId(invalid, validateIdFn)).toBe(false);
  });

  it("should return false if title is not a string", () => {
    const invalid = { ...validNewRecipe, title: 123 };
    expect(validateRecipeWithoutId(invalid, validateIdFn)).toBe(false);
  });

  it("should return false if ingredients contain an invalid item", () => {
    const invalid = {
      ...validNewRecipe,
      ingredients: [{ ...validIngredient, unit: "bad_unit" }],
    };
    expect(validateRecipeWithoutId(invalid, validateIdFn)).toBe(false);
  });

  it("should return false if userRatings has an invalid entry", () => {
    const invalid = {
      ...validNewRecipe,
      userRatings: [{ userId: "badId", rating: 5 }],
    };
    expect(validateRecipeWithoutId(invalid, validateIdFn)).toBe(false);
  });
});

describe("validateRecipe", () => {
  it("should return true for a valid recipe with id", () => {
    expect(validateRecipe(validRecipe, validateIdFn)).toBe(true);
  });

  it("should return false if both id and _id are present", () => {
    const recipeWithBothIds = {
      ...validNewRecipe,
      id: "validId",
      _id: "validId",
    };
    expect(validateRecipe(recipeWithBothIds, validateIdFn)).toBe(false);
  });

  it("should return true for a valid recipe with _id only", () => {
    const recipeWithObjectId = {
      ...validNewRecipe,
      _id: "validId",
    };
    expect(validateRecipe(recipeWithObjectId, validateIdFn)).toBe(true);
  });

  it("should return false if _id is invalid", () => {
    const invalid = {
      ...validNewRecipe,
      _id: "badId",
    };
    expect(validateRecipe(invalid, validateIdFn)).toBe(false);
  });
});
