import { MongoClient, ServerApiVersion, Db, GridFSBucket, Collection } from "mongodb";

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
    let globalWithMongo = global as typeof globalThis & {
      _mongoClient?: MongoClient;
    };

    if (!globalWithMongo._mongoClient) {
      globalWithMongo._mongoClient = new MongoClient(uri, options);
    }
    return globalWithMongo._mongoClient;
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
