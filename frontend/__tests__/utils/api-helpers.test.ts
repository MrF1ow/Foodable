import {
  getValueFromSearchParams,
  getRouteParam,
  getCreatorFromImageIdLocation,
} from "../../src/lib/utils/api-helpers";
import { CollectionNames } from "@/types";

describe("getValueFromSearchParams", () => {
  it("returns the correct value when param is present", () => {
    const req = { url: "https://example.com/api?foo=bar" } as Request;
    expect(getValueFromSearchParams(req, "foo")).toBe("bar");
  });

  it("returns null when param is missing", () => {
    const req = { url: "https://example.com/api?foo=bar" } as Request;
    expect(getValueFromSearchParams(req, "baz")).toBeNull();
  });

  it("throws an error when req.url is undefined", () => {
    const brokenReq = { url: undefined } as unknown as Request;
    expect(() => getValueFromSearchParams(brokenReq, "foo")).toThrow(
      "Request URL is undefined"
    );
  });
});

describe("getRouteParam", () => {
  it("returns the first element if param is an array", () => {
    expect(getRouteParam(["first", "second"])).toBe("first");
  });

  it("returns the param itself if it's a string", () => {
    expect(getRouteParam("justOne")).toBe("justOne");
  });

  it("returns null if param is undefined", () => {
    expect(getRouteParam(undefined)).toBeNull();
  });
});

describe("getCreatorFromImageIdLocation", () => {
  it('returns "creatorId" when collection is "recipes"', () => {
    expect(getCreatorFromImageIdLocation("recipes")).toBe("creatorId");
  });

  it('returns "_id" when collection is "users"', () => {
    expect(getCreatorFromImageIdLocation("users")).toBe("_id");
  });

  it("returns an empty string for unsupported collection names", () => {
    expect(getCreatorFromImageIdLocation("unknown" as CollectionNames)).toBe(
      ""
    );
  });
});
