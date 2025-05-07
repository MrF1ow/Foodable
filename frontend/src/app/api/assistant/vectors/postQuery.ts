import { getDB } from "@/lib/mongodb";
import { generateEmbeddings, normalize } from "@/lib/utils/embeddings";
import { getCurrentUser } from "@/lib/utils/user";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { userData, error, status } = await getCurrentUser({
            "createdRecipes._id": 1,
            "savedItems.recipes._id": 1,
            "savedItems.groceryLists._id": 1
        });

        console.log(userData);

        if (!userData) {
            return NextResponse.json({ message: error }, { status });
        }

        const { query } = await request.json();
        if (!query) {
            return NextResponse.json({ error: "Missing query in request body" }, { status: 400 });
        }

        const queryEmbedding = await generateEmbeddings(query);
        if (!queryEmbedding) {
            return NextResponse.json(
                { error: "Failed to generate embedding for query." },
                { status: 500 }
            );
        }

        const normalizedQuery = normalize(queryEmbedding);

        const savedRecipeIds = userData.savedItems.recipes.map((r: any) => ObjectId.createFromHexString(r._id));
        const savedGroceryIds = userData.savedItems.groceryLists.map((g: any) => ObjectId.createFromHexString(g._id));
        const createdRecipeIds = userData.createdRecipes.map((r: any) => ObjectId.createFromHexString(r._id.toString()));
        const vectorIds = [...savedRecipeIds, ...savedGroceryIds, ...createdRecipeIds, userData._id];

        console.log(vectorIds);

        const db = await getDB();
        const collection = db.collection("vectors");

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
                    referenceId: 1,
                    data: 1,
                    score: { $meta: "vectorSearchScore" },
                    type: 1,
                },
            },
            {
                $match: {
                    referenceId: { $in: vectorIds },
                },
            },
        ];


        const results: any[] = [];
        const cursor = collection.aggregate(pipeline);
        for await (const doc of cursor) {
            if (
                doc.score >= 0.7 ||
                doc.type === "preferences"
            ) {
                results.push(doc);
            }
        }

        return NextResponse.json({ query, result: results }, { status: 200 });

    } catch (err) {
        console.error("Vector search error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}