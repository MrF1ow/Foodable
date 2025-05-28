import { AddRecipeFormSchema } from "@/lib/validation/forms/schemas/"

const mockFile = new File(["image content"], "test.jpg", { type: "image/jpeg" });

describe("AddRecipeFormSchema", () => {
  const validData = {
    title: "Smoothie",
    description: "Blend all the things",
    image: mockFile,
    ingredients: [
      {
        name: "Banana",
        quantity: 1,
        unit: "pcs",
        category: "Fruit",
      },
    ],
    instructions: [{ step: "Blend ingredients." }],
  };

  it("should pass with valid data", () => {
    expect(() => AddRecipeFormSchema.parse(validData)).not.toThrow();
  });

  it("should fail with no ingredients", () => {
    const badData = { ...validData, ingredients: [] };
    expect(() => AddRecipeFormSchema.parse(badData)).toThrow(
      /At least one ingredient/
    );
  });

  it("should fail if image is empty file", () => {
    const badFile = new File([""], "empty.jpg", { type: "image/jpeg" });
    expect(() =>
      AddRecipeFormSchema.parse({ ...validData, image: badFile })
    ).toThrow(/Image is required/);
  });
});

