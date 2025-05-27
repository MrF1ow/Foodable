/**
 * @jest-environment node
 */

jest.mock("../../../src/lib/mongodb", () => ({
  getDB: jest.fn(),
}));

import {
  createAtlasVectorIndex,
  formatVectorContext,
} from "../../../src/lib/utils/vectors";
import { getDB } from "../../../src/lib/mongodb";

describe("createAtlasVectorIndex", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls createSearchIndex with the correct index definition", async () => {
    const createSearchIndex = jest.fn().mockResolvedValue("index created");
    const mockCollection = { createSearchIndex };
    const mockDb = { collection: () => mockCollection };

    (getDB as jest.Mock).mockResolvedValue(mockDb);

    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await createAtlasVectorIndex();

    expect(getDB).toHaveBeenCalled();
    expect(createSearchIndex).toHaveBeenCalledWith({
      name: "vector_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            similarity: "dotProduct",
            numDimensions: 1536,
          },
        ],
      },
    });
    expect(consoleSpy).toHaveBeenCalledWith("index created");

    consoleSpy.mockRestore();
  });

  it("fails silently if an error occurs", async () => {
    const mockCollection = {
      createSearchIndex: jest.fn().mockRejectedValue(new Error("fail")),
    };
    const mockDb = { collection: () => mockCollection };

    (getDB as jest.Mock).mockResolvedValue(mockDb);

    // No throw, just silent catch (as per implementation)
    await expect(createAtlasVectorIndex()).resolves.toBeUndefined();
  });
});

describe("formatVectorContext", () => {
  it("returns null if results is undefined", () => {
    expect(formatVectorContext(undefined as any)).toBeNull();
  });

  it("returns null if results is empty", () => {
    expect(formatVectorContext([])).toBeNull();
  });

  it("returns formatted content for valid results", () => {
    const input = [
      { type: "recipe", data: "Pasta" },
      { type: "preferences", data: "Low budget" },
    ];

    const result = formatVectorContext(input);

    expect(result).toEqual({
      role: "system",
      content:
        "The following is personalized data from the user:\n\n" +
        "Type: recipe\nData: Pasta\n\n" +
        "Type: preferences\nData: Low budget",
    });
  });
});
