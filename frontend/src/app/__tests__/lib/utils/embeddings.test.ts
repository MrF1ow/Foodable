/**
 * @jest-environment jsdom
 */

// Required to prevent `TextEncoder` errors from MongoDB/transformers
globalThis.TextEncoder = require("util").TextEncoder;
globalThis.TextDecoder = require("util").TextDecoder;

// Mock early to prevent real MongoDB and transformer internals from loading
jest.mock("../../../../lib/mongodb", () => ({
  getDB: jest.fn(),
}));

jest.mock("@xenova/transformers", () => ({
  pipeline: jest.fn(),
}));

describe("embeddings module", () => {
  const {
    normalize,
    formEmbeddingData,
    insertEmbeddings,
    deleteVectorEmbedding,
    generateEmbeddings,
  } = require("../../../../lib/utils/embeddings");

  const { getDB } = require("../../../../lib/mongodb");
  const { pipeline } = require("@xenova/transformers");
  const { ObjectId } = require("mongodb");

  const sampleId = new ObjectId();
  const sampleEmbedding = [0.3, 0.4, 0.5];

  describe("normalize", () => {
    it("normalizes a vector correctly", () => {
      const vec = [3, 4];
      const result = normalize(vec);
      const norm = Math.sqrt(3 ** 2 + 4 ** 2); // 5
      expect(result).toEqual([3 / norm, 4 / norm]);
    });
  });

  describe("formEmbeddingData", () => {
    it("formats recipe data correctly", () => {
      const data = {
        title: "Pasta",
        description: "Yum",
        ingredients: [],
        instructions: [],
        averageRating: 4.5,
        priceApproximation: 10,
        timeApproximation: 30,
      };
      expect(formEmbeddingData("recipe", data, sampleId)).toEqual({
        _id: sampleId,
        ...data,
      });
    });

    it("formats grocery data correctly", () => {
      const data = { title: "List", items: [] };
      expect(formEmbeddingData("grocery", data, sampleId)).toEqual({
        _id: sampleId,
        ...data,
      });
    });

    it("formats preferences data correctly", () => {
      const data = {
        dietaryRestrictions: [],
        budget: 100,
        foodTypePreferences: [],
      };
      expect(formEmbeddingData("preferences", data, sampleId)).toEqual({
        _id: sampleId,
        ...data,
      });
    });
  });

  describe("insertEmbeddings", () => {
    it("upserts documents with generated embeddings", async () => {
      const mockBulkWrite = jest.fn().mockResolvedValue({
        upsertedCount: 1,
        modifiedCount: 1,
      });

      getDB.mockResolvedValue({
        collection: () => ({ bulkWrite: mockBulkWrite }),
      });

      const embed = jest
        .fn()
        .mockResolvedValue({ data: Float32Array.from(sampleEmbedding) });
      pipeline.mockResolvedValue(embed);

      const data = [
        {
          _id: sampleId,
          title: "List",
          items: [{ name: "Milk" }],
        },
      ];

      await insertEmbeddings(data);
      expect(mockBulkWrite).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteVectorEmbedding", () => {
    it("deletes a vector and returns 0 on success", async () => {
      const deleteOne = jest.fn().mockResolvedValue({});
      getDB.mockResolvedValue({
        collection: () => ({ deleteOne }),
      });

      const result = await deleteVectorEmbedding(sampleId);
      expect(deleteOne).toHaveBeenCalledWith({ referenceId: sampleId });
      expect(result).toBe(0);
    });

    it("returns -1 on failure", async () => {
      getDB.mockRejectedValue(new Error("fail"));

      const result = await deleteVectorEmbedding(sampleId);
      expect(result).toBe(-1);
    });
  });

  describe("generateEmbeddings", () => {
    it("calls pipeline and returns result array", async () => {
      const embed = jest
        .fn()
        .mockResolvedValue({ data: Float32Array.from(sampleEmbedding) });
      pipeline.mockResolvedValue(embed);

      const result = await generateEmbeddings("text goes here");

      expect(result.length).toBe(sampleEmbedding.length);
      for (let i = 0; i < result.length; i++) {
        expect(result[i]).toBeCloseTo(sampleEmbedding[i], 5);
      }

      expect(pipeline).toHaveBeenCalledWith(
        "feature-extraction",
        "Xenova/nomic-embed-text-v1"
      );
      expect(embed).toHaveBeenCalledWith("text goes here", {
        pooling: "mean",
        normalize: true,
      });
    });
  });
});
