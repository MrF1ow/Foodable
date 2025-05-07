import { getDB } from "../mongodb";

export async function createAtlasVectorIndex() {
    try {
        const db = await getDB()
        const collection = db.collection("vectors")

        // Define your Atlas Vector Search index
        const index = {
            name: "vector_index",
            type: "vectorSearch",
            definition: {
                "fields": [
                    {
                        "type": "vector",
                        "path": "embedding",
                        "similarity": "dotProduct",
                        "numDimensions": 1536,
                    }
                ]
            }
        }

        // Call the method to create the index
        const result = await collection.createSearchIndex(index);
        console.log(result);
    } catch (error) {
        Error("error")
    }
}

type VectorResult = {
    type: string;
    data: string;
};

export function formatVectorContext(results: VectorResult[]) {
    if (!results || results.length === 0) return null;

    const contextContent = results
        .map((item) => `Type: ${item.type}\nData: ${item.data}`)
        .join("\n\n");

    return {
        role: "system" as const,
        content: `The following is personalized data from the user:\n\n${contextContent}`,
    };
}