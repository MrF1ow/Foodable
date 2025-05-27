import {
  capitalizeTitle,
  getIndexOfItemInArray,
} from "../../../src/lib/utils/general";

describe("capitalizeTitle", () => {
  it("capitalizes each word in a string", () => {
    expect(capitalizeTitle("hello world")).toBe("Hello World");
  });

  it("handles mixed casing correctly", () => {
    expect(capitalizeTitle("jAvAsCript IS aweSome")).toBe(
      "Javascript Is Awesome"
    );
  });

  it("handles single-word strings", () => {
    expect(capitalizeTitle("banana")).toBe("Banana");
  });

  it("returns an empty string when input is empty", () => {
    expect(capitalizeTitle("")).toBe("");
  });

  it("preserves spacing between words", () => {
    expect(capitalizeTitle("  leading and trailing  ")).toBe(
      "  Leading And Trailing  "
    );
  });
});

describe("getIndexOfItemInArray", () => {
  it("returns correct index of a primitive value", () => {
    expect(getIndexOfItemInArray(3, [1, 2, 3, 4])).toBe(2);
  });

  it("returns -1 when the item is not in the array", () => {
    expect(getIndexOfItemInArray("x", ["a", "b", "c"])).toBe(-1);
  });

  it("returns correct index when comparing by strict equality", () => {
    const obj = { id: 1 };
    const list = [{ id: 1 }, obj];
    expect(getIndexOfItemInArray(obj, list)).toBe(1);
  });

  it("returns -1 when objects are structurally equal but not the same instance", () => {
    expect(getIndexOfItemInArray({ id: 1 }, [{ id: 1 }])).toBe(-1);
  });
});
