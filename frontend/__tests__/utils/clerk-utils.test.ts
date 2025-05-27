/**
 * @jest-environment jsdom
 */
import {
  checkRole,
  checkOnboarding,
  checkSession,
  getUserDetails,
  getClerkUserId,
} from "../../src/lib/utils/clerk-utils";

import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
  currentUser: jest.fn(),
}));

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({ body, status: init?.status })),
  },
}));

describe("checkRole", () => {
  it("returns true if role matches", async () => {
    (auth as unknown as jest.Mock).mockResolvedValue({
      sessionClaims: { metadata: { role: "admin" } },
    });

    const result = await checkRole("admin");
    expect(result).toBe(true);
  });

  it("returns false if role does not match", async () => {
    (auth as unknown as jest.Mock).mockResolvedValue({
      sessionClaims: { metadata: { role: "user" } },
    });

    const result = await checkRole("admin");
    expect(result).toBe(false);
  });
});

describe("checkOnboarding", () => {
  it("returns true if onboardingComplete is true", async () => {
    (auth as unknown as jest.Mock).mockResolvedValue({
      sessionClaims: { metadata: { onboardingComplete: true } },
    });

    const result = await checkOnboarding();
    expect(result).toBe(true);
  });

  it("returns false if onboardingComplete is false", async () => {
    (auth as unknown as jest.Mock).mockResolvedValue({
      sessionClaims: { metadata: { onboardingComplete: false } },
    });

    const result = await checkOnboarding();
    expect(result).toBe(false);
  });
});

describe("checkSession", () => {
  it("returns true if sessionClaims exists", async () => {
    (auth as unknown as jest.Mock).mockResolvedValue({
      sessionClaims: { metadata: {} },
    });

    const result = await checkSession();
    expect(result).toBe(true);
  });

  it("returns false if sessionClaims is null", async () => {
    (auth as unknown as jest.Mock).mockResolvedValue({
      sessionClaims: null,
    });

    const result = await checkSession();
    expect(result).toBe(false);
  });
});

describe("getUserDetails", () => {
  it("returns userName and userPfp if present", async () => {
    (currentUser as unknown as jest.Mock).mockResolvedValue({
      username: "nick",
      imageUrl: "http://example.com/pfp.png",
    });

    const result = await getUserDetails();
    expect(result).toEqual({
      userName: "nick",
      userPfp: "http://example.com/pfp.png",
    });
  });

  it("returns undefined values if user is null", async () => {
    (currentUser as unknown as jest.Mock).mockResolvedValue(null);

    const result = await getUserDetails();
    expect(result).toEqual({
      userName: undefined,
      userPfp: undefined,
    });
  });
});

describe("getClerkUserId", () => {
  it("returns user id if present", async () => {
    (currentUser as unknown as jest.Mock).mockResolvedValue({
      id: "user_123",
    });

    const result = await getClerkUserId();
    expect(result).toBe("user_123");
  });

  it("returns 404 response if user is null", async () => {
    (currentUser as unknown as jest.Mock).mockResolvedValue(null);

    const result = await getClerkUserId();
    expect(result).toEqual({
      body: { message: "User not found" },
      status: 404,
    });
  });
});
