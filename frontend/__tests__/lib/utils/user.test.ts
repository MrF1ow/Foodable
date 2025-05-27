/**
 * @jest-environment node
 */

jest.mock("@clerk/nextjs/server", () => ({
  currentUser: jest.fn(),
}));

jest.mock("../../../src/lib/mongodb", () => ({
  getDB: jest.fn(),
}));

import { getCurrentUser } from "../../../src/lib/utils/user";
import { currentUser } from "@clerk/nextjs/server";
import { getDB } from "../../../src/lib/mongodb";
import { HTTP_RESPONSES } from "../../../src/lib/constants/httpResponses";

describe("getCurrentUser", () => {
  const mockUserId = "user_123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 404 if no Clerk user is found", async () => {
    (currentUser as unknown as jest.Mock).mockResolvedValue(null);

    const result = await getCurrentUser();
    expect(result).toEqual({
      userData: null,
      error: "User not found",
      status: 404,
    });
  });

  it("returns 404 if no user profile is found in the DB", async () => {
    (currentUser as unknown as jest.Mock).mockResolvedValue({ id: mockUserId });

    const findOne = jest.fn().mockResolvedValue(null);
    (getDB as unknown as jest.Mock).mockResolvedValue({
      collection: () => ({ findOne }),
    });

    const result = await getCurrentUser();
    expect(result).toEqual({
      userData: null,
      error: HTTP_RESPONSES.NOT_FOUND ?? "User profile not found",
      status: 404,
    });
    expect(findOne).toHaveBeenCalledWith({ clerkId: mockUserId }, undefined);
  });

  it("returns user data successfully without projection", async () => {
    const mockData = { clerkId: mockUserId, name: "Nick" };

    (currentUser as unknown as jest.Mock).mockResolvedValue({ id: mockUserId });
    const findOne = jest.fn().mockResolvedValue(mockData);
    (getDB as unknown as jest.Mock).mockResolvedValue({
      collection: () => ({ findOne }),
    });

    const result = await getCurrentUser();
    expect(result).toEqual({
      userData: mockData,
      error: null,
      status: 200,
    });
  });

  it("passes projection when provided", async () => {
    const mockData = { name: "Nick" };
    const projection = { name: 1 };

    (currentUser as unknown as jest.Mock).mockResolvedValue({ id: mockUserId });
    const findOne = jest.fn().mockResolvedValue(mockData);
    (getDB as unknown as jest.Mock).mockResolvedValue({
      collection: () => ({ findOne }),
    });

    const result = await getCurrentUser(projection);
    expect(findOne).toHaveBeenCalledWith(
      { clerkId: mockUserId },
      { projection }
    );
    expect(result).toEqual({
      userData: mockData,
      error: null,
      status: 200,
    });
  });
});
