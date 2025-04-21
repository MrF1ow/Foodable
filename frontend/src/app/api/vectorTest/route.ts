import { getDB } from "@/lib/mongodb";
import { getEmbedding } from "@/lib/utils/get-embeddings";
import { NextResponse } from "next/server";

function normalize(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map((val) => val / norm);
}

export async function GET(request: Request) {
  try {
    const db = await getDB();
    const collection = db.collection("vectors");

    const sampleItems = [
      {
        text: "A cozy beach house with ocean views and a large deck.",
        summary: "Cozy beach house with ocean views",
      },
      {
        text: "A modern cabin in the woods, perfect for a quiet retreat.",
        summary: "Modern woodland cabin",
      },
      {
        text: "A spacious apartment in the city center with skyline views.",
        summary: "City center apartment",
      },
      {
        text: "A minimalist desert house with beautiful sunset views.",
        summary: "Desert sunset home",
      },
      {
        text: "A luxurious mountain lodge with hiking trails nearby.",
        summary: "Luxury mountain lodge",
      },
    ];

    await collection.deleteMany({});

    for (const item of sampleItems) {
      const embedding = await getEmbedding(item.text);
      console.log("Embedding length for:", item.summary, embedding?.length);
      if (!embedding) continue;
      await collection.insertOne({
        ...item,
        embedding: normalize(embedding),
      });
    }
    const allDocs = await collection.find().toArray();
  console.log("All inserted docs:", allDocs);


    // Parse query
    const { searchParams } = new URL(request.url);
    const userQuery = searchParams.get("q") || "beach house";

    const queryEmbedding = await getEmbedding(userQuery);
    if (!queryEmbedding) {
      return NextResponse.json(
        { error: "Failed to generate embedding for query." },
        { status: 500 }
      );
    }
    console.log("EEY EDSFST", queryEmbedding);
    const normalizedQuery = normalize(queryEmbedding);

    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index",
          queryVector: normalizedQuery,
          path: "embedding",
          exact: false,
          limit: 5,
          numCandidates: 100,
        },
      },
      {
        $project: {
          _id: 0,
          summary: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ];

    const results = [];
    const cursor = collection.aggregate(pipeline);
    console.log("cursor: ", cursor)
    for await (const doc of cursor) {
      results.push(doc);
    }


    return NextResponse.json(
      {
        query: userQuery,
        result: results,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Vector search error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
