import { MongoClient, ServerApiVersion, Db, GridFSBucket, Collection } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { getEmbedding } from './utils/get-embeddings';
// import { convertEmbeddingsToBSON } from './convert-embeddings.js';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    deprecationErrors: true,
  },
};

let client: MongoClient;

export async function connectDB(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClient?: MongoClient;
    };

    if (!globalWithMongo._mongoClient) {
      globalWithMongo._mongoClient = new MongoClient(uri, options);
    }
    return globalWithMongo._mongoClient;
  } else {
    client = new MongoClient(uri, options);
  }

  try {
    await client.connect();
    console.log("== Connected to MongoDB");
    return client;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
}

export async function getDB(): Promise<Db> {
  const client = await connectDB();
  return client.db(process.env.MONGODB_ATLAS_DB_NAME || "foodable_db");
}

export async function setupGridFS(): Promise<{ bucket: GridFSBucket; db: Db }> {
  const db = await getDB();
  const bucket = new GridFSBucket(db, {
    bucketName: "images",
  });
  console.log("== GridFS setup complete");
  return { bucket, db };
}

export async function setupVectorStore(): Promise<MongoDBAtlasVectorSearch> {
  const db = await getDB();
  const collection: Collection = db.collection(
    process.env.MONGODB_ATLAS_COLLECTION_NAME || "users"
  );

  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });

  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "vector_index",
    textKey: "text",
    embeddingKey: "embedding",
  });

  console.log("== Vector store setup complete");
  return vectorStore;
}

// === Embedding Generation & Update Logic ===

export async function generateAndStoreEmbeddings(): Promise<void> {
  const db = await getDB();
  const collection = db.collection("vectors");

  const filter = { summary: { $nin: [null, ""] } };

  try {
    const documents = await collection.find(filter).limit(50).toArray();
    console.log("Generating embeddings and updating documents...");

    const updateDocuments: any = [];

    await Promise.all(documents.map(async doc => {
      let embedding = await getEmbedding(doc.summary);
    
      if (!embedding) {
        console.warn(`⚠️ Skipping doc ${doc._id}: No embedding returned`);
        return;
      }
    
      updateDocuments.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { embedding } },
        },
      });
    }));
    
    if (updateDocuments.length === 0) {
      console.warn("⚠️ No documents to update. Exiting early.");
      return;
    }
    
    const result = await collection.bulkWrite(updateDocuments, { ordered: false });
    console.log("✅ Count of documents updated:", result.modifiedCount);
  } catch (err) {
    console.error("Error generating/storing embeddings:", err);
  }
}
