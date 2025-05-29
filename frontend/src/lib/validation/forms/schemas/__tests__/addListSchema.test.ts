import { AddListFormSchema } from "@/lib/validation/forms/schemas/"

describe("AddListFormSchema", () => {
  const validData = {
    title: "Grocery Run",
    category: "Essentials",
  };

  it("should pass with valid data", () => {
    expect(() => AddListFormSchema.parse(validData)).not.toThrow();
  });

  it("should fail with missing title", () => {
    expect(() =>
      AddListFormSchema.parse({ ...validData, title: "" })
    ).toThrow(/Title is Required/);
  });
});
