import { getDB } from "@/lib/mongodb";
import { generateEmbeddings, normalize } from "@/lib/utils/embeddings";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { query } = await request.json();
        if (!query) {
            return NextResponse.json({ error: "Missing query in request body" }, { status: 400 });
        }

        const db = await getDB();
        const collection = db.collection("vectors");

        const queryEmbedding = await generateEmbeddings(query);
        if (!queryEmbedding) {
            return NextResponse.json(
                { error: "Failed to generate embedding for query." },
                { status: 500 }
            );
        }

        const normalizedQuery = normalize(queryEmbedding);

        const pipeline = [
            {
                $vectorSearch: {
                    index: "vector_index",
                    queryVector: normalizedQuery,
                    path: "embedding",
                    limit: 5,
                    numCandidates: 100,
                },
            },
            {
                $project: {
                    _id: 0,
                    data: 1,
                    score: { $meta: "vectorSearchScore" },
                    type: 1
                },
            },
            {
                $match: {
                    score: { $gte: 0.6 }
                }
            }
        ];

        const results: any[] = [];
        const cursor = collection.aggregate(pipeline);
        for await (const doc of cursor) {
            results.push(doc);
        }

        return NextResponse.json({ query, result: results }, { status: 200 });

    } catch (err) {
        console.error("Vector search error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}