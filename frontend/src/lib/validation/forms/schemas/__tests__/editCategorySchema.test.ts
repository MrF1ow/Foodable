import { EditCategoryFormSchema } from "@/lib/validation/forms/schemas";

describe("EditCategoryFormSchema", () => {
  it("should pass with a valid category name", () => {
    const result = EditCategoryFormSchema.safeParse({ name: "Groceries" });
    expect(result.success).toBe(true);
  });

  it("should fail when name is empty", () => {
    const result = EditCategoryFormSchema.safeParse({ name: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().name?._errors).toContain("Category is Required");
    }
  });

  it("should fail when name exceeds 25 characters", () => {
    const longName = "a".repeat(26);
    const result = EditCategoryFormSchema.safeParse({ name: longName });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().name?._errors).toContain("Category title must be 25 characters or fewer.");
    }
  });

  it("should fail when name is 'My Items' (case-insensitive)", () => {
    const result = EditCategoryFormSchema.safeParse({ name: "My Items" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().name?._errors).toContain("You cannot use 'My Items' as a category name.");
    }
  });

  it("should fail when name is ' my items ' with spaces and different casing", () => {
    const result = EditCategoryFormSchema.safeParse({ name: "  my items  " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format().name?._errors).toContain("You cannot use 'My Items' as a category name.");
    }
  });
});