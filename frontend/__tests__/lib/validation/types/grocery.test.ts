import { validateGroceryItem, validateGroceryListWithoutId, validateGroceryList} from '@/lib/validation/types/grocery'
import { unitOptions } from "@/config/unit-conversions";
import { grocerySectionOptions } from "@/config/grocery-sections";
import { GroceryItem } from "@/types/grocery";

const mockValidUnit = Object.values(unitOptions)[0];
const mockValidCategory = Object.values(grocerySectionOptions)[0];

const mockValidateId = (id: any) =>
  typeof id === "string" && id.startsWith("user_");

describe("validateGroceryItem", () => {
  it("should validate a correct GroceryItem", () => {
    const item: GroceryItem = {
      name: "Apple",
      quantity: 3,
      unit: mockValidUnit,
      category: mockValidCategory,
      checked: false,
    };
    expect(validateGroceryItem(item)).toBe(true);
  });

  it("should fail for missing or invalid fields", () => {
    const invalidItems = [
      {}, // empty object
      { name: "Apple" }, // missing required fields
      { name: "Apple", quantity: "3", unit: mockValidUnit, category: mockValidCategory, checked: false }, // quantity not number
      { name: "Apple", quantity: 3, unit: "not-real-unit", category: mockValidCategory, checked: false },
      { name: "Apple", quantity: 3, unit: mockValidUnit, category: "invalid-category", checked: false },
      { name: "Apple", quantity: 3, unit: mockValidUnit, category: mockValidCategory, checked: "nope" },
    ];

    invalidItems.forEach(item => {
      expect(validateGroceryItem(item)).toBe(false);
    });
  });
});

describe("validateGroceryListWithoutId", () => {
  it("should validate a proper grocery list", () => {
    const groceryList = {
      creatorId: "user_abc123def456ghi789jkl012mno",
      title: "My List",
      items: [
        {
          name: "Banana",
          quantity: 2,
          unit: mockValidUnit,
          category: mockValidCategory,
          checked: true,
        },
      ],
      timestamp: new Date().toISOString(),
    };
    expect(validateGroceryListWithoutId(groceryList, mockValidateId)).toBe(true);
  });

  it("should allow empty items", () => {
    const groceryList = {
      creatorId: "user_abc123def456ghi789jkl012mno",
      title: "Empty List",
      items: [],
    };
    expect(validateGroceryListWithoutId(groceryList, mockValidateId)).toBe(true);
  });

  it("should reject list with invalid item", () => {
    const groceryList = {
      creatorId: "user_abc123def456ghi789jkl012mno",
      title: "Bad List",
      items: [
        {
          name: "InvalidItem",
          quantity: "five",
          unit: mockValidUnit,
          category: mockValidCategory,
          checked: false,
        },
      ],
    };
    expect(validateGroceryListWithoutId(groceryList, mockValidateId)).toBe(false);
  });

  it("should reject list with invalid creatorId", () => {
    const groceryList = {
      creatorId: "bad_user",
      title: "Invalid ID",
      items: [],
    };
    expect(validateGroceryListWithoutId(groceryList, mockValidateId)).toBe(false);
  });
});

describe("validateGroceryList", () => {
  it("should validate with string _id", () => {
    const groceryList = {
      _id: "user_abc123def456ghi789jkl012mno",
      creatorId: "user_abc123def456ghi789jkl012mno",
      title: "Test List",
      items: [],
    };
    expect(validateGroceryList(groceryList, mockValidateId)).toBe(true);
  });

  it("should reject with invalid _id", () => {
    const groceryList = {
      _id: "invalid_id",
      creatorId: "user_abc123def456ghi789jkl012mno",
      title: "Test List",
      items: [],
    };
    expect(validateGroceryList(groceryList, mockValidateId)).toBe(false);
  });

  it("should work with id instead of _id", () => {
    const groceryList = {
      id: "user_abc123def456ghi789jkl012mno",
      creatorId: "user_abc123def456ghi789jkl012mno",
      title: "Alternate ID List",
      items: [],
    };
    expect(validateGroceryList(groceryList, mockValidateId)).toBe(true);
  });

  it("should reject missing creatorId", () => {
    const groceryList = {
      _id: "user_abc123def456ghi789jkl012mno",
      title: "No Creator",
      items: [],
    };
    expect(validateGroceryList(groceryList, mockValidateId)).toBe(false);
  });
});
