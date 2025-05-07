import { getDB } from "@/lib/mongodb";
import { generateEmbeddings, normalize } from "@/lib/utils/embeddings";
import { getCurrentUser } from "@/lib/utils/user";
import { formatVectorContext } from "@/lib/utils/vectors";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 30;

export async function POST(request: Request) {
    try {
        const { userData, error, status } = await getCurrentUser({
            "createdRecipes._id": 1,
            "savedItems.recipes._id": 1,
            "savedItems.groceryLists._id": 1
        });

        if (!userData) {
            return NextResponse.json({ message: error }, { status });
        }

        const { messages } = await request.json();
        if (!messages) {
            return NextResponse.json({ error: "Missing query in request body" }, { status: 400 });
        }

        const messagesLength = messages.length
        const query = messages[messagesLength - 1].content

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

        const contextMessage = formatVectorContext(results);

        const result = streamText({
            model: openai('gpt-4.1'),
            messages: [
                {
                    role: "system",
                    content: "You are a helpful food assistant. Use user preferences and saved data when relevant.",
                },
                ...(contextMessage ? [contextMessage] : []),
                ...messages
            ],
        });

        return result.toDataStreamResponse();

    } catch (err) {
        console.error("Vector search error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}