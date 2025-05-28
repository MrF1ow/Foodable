import { AddItemFormSchema } from "@/lib/validation/forms/schemas/"

describe("AddItemFormSchema", () => {
  const validData = {
    itemName: "Bananas",
    quantity: 2,
    category: "Fruit",
    unit: "kg", // this must match an entry in `unitsAsTuple`
  };

  it("should pass with valid data", () => {
    expect(() => AddItemFormSchema.parse(validData)).not.toThrow();
  });

  it("should fail with short item name", () => {
    expect(() =>
      AddItemFormSchema.parse({ ...validData, itemName: "A" })
    ).toThrow(/at least 3 characters/);
  });

  it("should fail with invalid quantity", () => {
    expect(() =>
      AddItemFormSchema.parse({ ...validData, quantity: 0 })
    ).toThrow(/at least 1/);
  });

  it("should fail with invalid unit", () => {
    expect(() =>
      AddItemFormSchema.parse({ ...validData, unit: "invalid" as any })
    ).toThrow(/Invalid enum value/);
  });
});
