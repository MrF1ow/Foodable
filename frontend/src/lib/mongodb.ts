import { MongoClient, ServerApiVersion, Db, GridFSBucket, Collection } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";

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
