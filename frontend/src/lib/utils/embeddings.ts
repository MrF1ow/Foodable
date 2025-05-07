import { getDB } from '../mongodb';
import { ObjectId } from 'mongodb';
import { pipeline } from '@xenova/transformers';
import { GroceryListForEmbedding, PreferencesForEmbedding, RecipeForEmbedding } from '@/types/vector';

type EmbeddableInput = RecipeForEmbedding | GroceryListForEmbedding | PreferencesForEmbedding;
type VectorDocument = {
    data: string;
    referenceId: ObjectId;
    embedding: number[];
    type: 'recipe' | 'grocery' | 'preferences';
};

function defaultTextExtractor(input: EmbeddableInput): string {
    if ('ingredients' in input && 'instructions' in input) {
        return `${input.title}. ${input.description}. ${input.ingredients.map(i => i.name).join(', ')}. ${input.instructions.join(' ')}`;
    }

    if ('items' in input && 'title' in input) {
        return `${input.title}. ${input.items.map(i => i.name).join(', ')}`;
    }

    if ('dietaryRestrictions' in input && 'budget' in input) {
        return `Dietary: ${input.dietaryRestrictions.join(', ')}. Budget: ${input.budget}. Preferences: ${input.foodTypePreferences.join(', ')}`;
    }

    throw new Error('Unsupported input type');
}

function detectType(item: EmbeddableInput): VectorDocument["type"] {
    if ('ingredients' in item) return 'recipe';
    if ('items' in item) return 'grocery';
    return 'preferences';
}

export function normalize(vector: number[]): number[] {
    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map((val) => val / norm);
}

export function formEmbeddingData(type: VectorDocument["type"], data: any, id: ObjectId) {
    if (type === "recipe") {
        return {
            _id: id,
            title: data.title,
            description: data.description,
            ingredients: data.ingredients,
            instructions: data.instructions,
            averageRating: data.averageRating,
            priceApproximation: data.priceApproximation,
            timeApproximation: data.timeApproximation,
        }
    } else if (type === "grocery") {
        return {
            _id: id,
            title: data.title,
            items: data.items
        }
    } else {
        return {
            _id: id,
            ...data
        }
    }
}

export async function insertEmbeddings(
    data: EmbeddableInput[],
    textExtractor: (item: EmbeddableInput) => string = defaultTextExtractor
): Promise<void> {
    const db = await getDB();
    const collection = db.collection("vectors");

    const operations = await Promise.all(
        data.map(async (item: EmbeddableInput) => {
            const id = (item as any)._id as ObjectId;
            if (!id) throw new Error("Item missing _id field");

            const text = textExtractor(item);
            const embedding = await generateEmbeddings(text) as number[];

            return {
                updateOne: {
                    filter: { referenceId: id },
                    update: {
                        $set: {
                            data: text,
                            referenceId: id,
                            embedding,
                            type: detectType(item),
                        },
                    },
                    upsert: true,
                },
            };
        })
    );

    if (operations.length > 0) {
        const result = await collection.bulkWrite(operations, { ordered: false });
        console.log("Upserted/Updated vector embeddings:", result.upsertedCount + result.modifiedCount);
    } else {
        console.log("No vector embeddings to insert or update.");
    }
}

export async function deleteVectorEmbedding(_id: ObjectId) {
    try {
        const db = await getDB();
        await db.collection("vectors").deleteOne(
            { referenceId: _id }
        )
        return 0;
    } catch (error) {
        console.log("Error Deleting Vector Embedding", error)
        return -1;
    }
}

// Function to generate embeddings for a given data source
export async function generateEmbeddings(data: any) {
    const embedder = await pipeline(
        'feature-extraction',
        'Xenova/nomic-embed-text-v1');
    const results = await embedder(data, { pooling: 'mean', normalize: true });
    return Array.from(results.data);
}

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