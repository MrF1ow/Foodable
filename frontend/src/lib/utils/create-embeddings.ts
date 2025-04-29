import { MongoClient } from 'mongodb';
import { getEmbedding } from './get-embeddings.js'
// import { convertEmbeddingsToBSON } from './convert-embeddings.js';
import dotenv from 'dotenv';
import { getDB } from '../mongodb.js';

dotenv.config();

const texts: string[] = [ 
    "Titanic: The story of the 1912 sinking of the largest luxury liner ever built",
    "The Lion King: Lion cub and future king Simba searches for his identity",
    "Avatar: A marine is dispatched to the moon Pandora on a unique mission"
];

async function run(): Promise<void> {
    const uri = process.env.ATLAS_CONNECTION_STRING;
    if (!uri) {
        throw new Error("ATLAS_CONNECTION_STRING is not defined in .env");
    }

    try {
        const db = await getDB()
        const collection = db.collection("vectors")

        console.log("Generating embeddings and inserting documents...");
        const insertDocuments: { text: string, embedding: number[] }[] = [];

        await Promise.all(texts.map(async (text: string) => {
            const existingDoc = await collection.findOne({ text });

            let embedding = await getEmbedding(text) as number[];

            // Optional BSON conversion
            // const bsonEmbedding = await convertEmbeddingsToBSON([embedding]);
            // embedding = bsonEmbedding[0];

            if (!existingDoc) {
                insertDocuments.push({ text, embedding });
            }
        }));

        const options = { ordered: false };
        const result = await collection.insertMany(insertDocuments, options);
        console.log("Count of documents inserted: " + result.insertedCount);

    } catch (err) {
        console.error(err);
    }
}

run().catch(console.error);
