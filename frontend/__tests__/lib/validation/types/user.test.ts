import {
  validateSettings,
  validatePreferences,
  validateUserFollow,
  validateUserRating,
  validateUserWithoutID,
  validateUser,
} from "@/lib/validation/types/user";
import { NewUser } from "@/types/user";

const mockValidateIdFn = jest.fn((id) => typeof id === "string" && id.length > 0);

import { isValidUserId, isValidStringArray } from "@/lib/validation/types/general";

jest.mock("@/lib/validation/types/general", () => ({
  isValidUserId: jest.fn((id) => typeof id === "string" && id.startsWith("user_")),
  isValidStringArray: jest.fn((arr) => Array.isArray(arr) && arr.every((s) => typeof s === "string")),
}));

describe("User Validation Tests", () => {
  beforeEach(() => {
    mockValidateIdFn.mockClear();
    (isValidUserId as jest.Mock).mockClear();
    (isValidStringArray as jest.Mock).mockClear();
  });

  describe("validateSettings", () => {
    it("returns true for valid themes", () => {
      expect(validateSettings({ theme: "light" })).toBe(true);
      expect(validateSettings({ theme: "dark" })).toBe(true);
    });
    it("returns false for invalid or missing theme", () => {
      expect(validateSettings({ theme: "blue" })).toBe(false);
      expect(validateSettings(null)).toBe(false);
      expect(validateSettings(undefined)).toBe(false);
      expect(validateSettings({})).toBe(false);
    });
  });

describe("validatePreferences", () => {
  it("returns true for valid preferences", () => {
    (isValidStringArray as jest.Mock).mockReturnValue(true);
    expect(validatePreferences({
      dietaryRestrictions: ["gluten-free"],
      foodTypePreferences: ["vegetarian"],
      budget: 50,
    })).toBe(true);
  });

  it("returns false for invalid preferences", () => {
    (isValidStringArray as jest.Mock).mockReturnValue(false);
    expect(validatePreferences({
      dietaryRestrictions: "not-an-array",
      foodTypePreferences: ["vegetarian"],
      budget: 50,
    })).toBe(false);
  });
});

  describe("validateUserFollow", () => {
    it("returns true for valid FollowMetadata", () => {
      mockValidateIdFn.mockReturnValue(true);
      const follow = {
        _id: "123",
        imageId: "456",
        username: "testuser",
        type: "follow",
      };
      expect(validateUserFollow(follow, mockValidateIdFn)).toBe(true);
      expect(mockValidateIdFn).toHaveBeenCalledWith("123");
      expect(mockValidateIdFn).toHaveBeenCalledWith("456");
    });

    it("returns true if imageId is null", () => {
      mockValidateIdFn.mockReturnValue(true);
      const follow = {
        _id: "123",
        imageId: null,
        username: "testuser",
        type: "follow",
      };
      expect(validateUserFollow(follow, mockValidateIdFn)).toBe(true);
    });

    it("returns false if any required field invalid", () => {
      mockValidateIdFn.mockReturnValue(false);
      expect(validateUserFollow({ _id: "bad", imageId: "img", username: "user" }, mockValidateIdFn)).toBe(false);
      expect(validateUserFollow({ _id: "id", imageId: "img", username: 123 }, mockValidateIdFn)).toBe(false);
      expect(validateUserFollow(null, mockValidateIdFn)).toBe(false);
    });
  });

  describe("validateUserRating", () => {
    it("returns true for valid UserRating", () => {
      mockValidateIdFn.mockReturnValue(true);
      const rating = {
        userId: "user123",
        comment: "Great!",
        rating: 4,
      };
      expect(validateUserRating(rating, mockValidateIdFn)).toBe(true);
    });
    it("returns false for invalid UserRating", () => {
      mockValidateIdFn.mockReturnValue(false);
      expect(validateUserRating({ userId: "bad", comment: "x", rating: 3 }, mockValidateIdFn)).toBe(false);
      expect(validateUserRating({ userId: "user123", comment: 123, rating: 3 }, mockValidateIdFn)).toBe(false);
      expect(validateUserRating({ userId: "user123", comment: "Good", rating: "high" }, mockValidateIdFn)).toBe(false);
      expect(validateUserRating(null, mockValidateIdFn)).toBe(false);
    });
  });

  describe("validateUserWithoutID", () => {
    const validUser = {
      username: "testuser",
      email: "test@example.com",
      settings: { theme: "light" },
      imageId: "img123",
      preferences: {
        dietaryRestrictions: ["vegan"],
        foodTypePreferences: ["fruit"],
        budget: 100,
      },
      savedItems: {
        recipes: [{ _id: "r1" }],
        groceryLists: [{ _id: "g1" }],
      },
      createdRecipes: ["rec1"],
      following: [{ _id: "f1", imageId: "imgf1", username: "follow1" }],
      followers: [{ _id: "f2", imageId: null, username: "follow2" }],
      currentGroceryList: "cg1",
      lastLogin: new Date(),
      dateJoined: new Date(),
    };

    it("returns true for valid user without ID", () => {
      mockValidateIdFn.mockReturnValue(true);
      expect(validateUserWithoutID(validUser, mockValidateIdFn)).toBe(true);
    });

    it("returns false if any nested validation fails", () => {
      mockValidateIdFn.mockReturnValue(false);
      expect(validateUserWithoutID(validUser, mockValidateIdFn)).toBe(false);
      expect(validateUserWithoutID(null as any, mockValidateIdFn)).toBe(false);
    });
  });

  describe("validateUser", () => {
    const baseUser = {
      _id: "user123",
      clerkId: "user_clerk123",
      username: "testuser",
      email: "test@example.com",
      settings: { theme: "dark" },
      preferences: {
        dietaryRestrictions: ["vegan"],
        foodTypePreferences: ["fruit"],
        budget: 100,
      },
      savedItems: {
        recipes: [],
        groceryLists: [],
      },
      createdRecipes: [],
      following: [],
      followers: [],
      currentGroceryList: null,
    };

    it("returns false if user is null or undefined", () => {
      expect(validateUser(null, mockValidateIdFn)).toBe(false);
      expect(validateUser(undefined, mockValidateIdFn)).toBe(false);
    });

    it("returns false if _id fails validation", () => {
      mockValidateIdFn.mockReturnValue(false);
      expect(validateUser(baseUser, mockValidateIdFn)).toBe(false);
    });

    it("returns false if clerkId invalid", () => {
      mockValidateIdFn.mockReturnValue(true);
      (isValidUserId as jest.Mock).mockReturnValue(false);
      expect(validateUser(baseUser, mockValidateIdFn)).toBe(false);
    });

    it("returns true for valid user", () => {
      mockValidateIdFn.mockReturnValue(true);
      (isValidUserId as jest.Mock).mockReturnValue(true);
      expect(validateUser(baseUser, mockValidateIdFn)).toBe(true);
    });
  });
});

