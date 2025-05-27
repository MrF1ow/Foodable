import {
  createTagsForRecipe,
  compareTag,
} from "../../../src/lib/utils/recipe-tags";
import { RecipeIngredient } from "@/types/recipe";
import { FilterTag } from "@/types";

describe("createTagsForRecipe", () => {
  const makeIngredients = (count: number): RecipeIngredient[] =>
    Array.from({ length: count }, (_, i) => ({
      name: `ingredient${i}`,
      quantity: 1,
      unit: "unit",
      category: "Produce",
    }));

  it("returns lowest tags for minimum inputs", () => {
    const tags: FilterTag = createTagsForRecipe(10, makeIngredients(3), 2);
    expect(tags).toEqual({ time: 1, ingredient: 1, price: 1 });
  });

  it("returns middle range tags", () => {
    const tags: FilterTag = createTagsForRecipe(30, makeIngredients(8), 10);
    expect(tags).toEqual({ time: 2, ingredient: 2, price: 2 });
  });

  it("returns upper range tags", () => {
    const tags: FilterTag = createTagsForRecipe(50, makeIngredients(15), 18);
    expect(tags).toEqual({ time: 4, ingredient: 4, price: 4 });
  });

  it("returns max tags for large values", () => {
    const tags: FilterTag = createTagsForRecipe(90, makeIngredients(20), 100);
    expect(tags).toEqual({ time: 5, ingredient: 5, price: 5 });
  });
});

describe("compareTag", () => {
  it("returns 0 if direction is 0", () => {
    expect(compareTag(5, 3, 0)).toBe(0);
    expect(compareTag(3, 5, 0)).toBe(0);
  });

  it("returns a - b if direction is 1", () => {
    expect(compareTag(5, 3, 1)).toBe(2);
    expect(compareTag(3, 5, 1)).toBe(-2);
  });

  it("returns b - a if direction is -1", () => {
    expect(compareTag(5, 3, -1)).toBe(-2);
    expect(compareTag(3, 5, -1)).toBe(2);
  });
});
