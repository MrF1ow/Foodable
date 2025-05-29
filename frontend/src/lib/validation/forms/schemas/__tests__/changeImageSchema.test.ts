import { ChangeImageFormSchema } from "@/lib/validation/forms/schemas/"

const mockFile = new File(["image content"], "test.jpg", { type: "image/jpeg" });

describe("ChangeImageFormSchema", () => {
  it("should pass with valid image file", () => {
    expect(() =>
      ChangeImageFormSchema.parse({ image: mockFile })
    ).not.toThrow();
  });

  it("should pass with null image (optional)", () => {
    expect(() =>
      ChangeImageFormSchema.parse({ image: null })
    ).not.toThrow();
  });

  it("should fail with zero-byte file", () => {
    const badFile = new File([""], "empty.jpg", { type: "image/jpeg" });
    expect(() =>
      ChangeImageFormSchema.parse({ image: badFile })
    ).toThrow(/Image is required/);
  });
});
