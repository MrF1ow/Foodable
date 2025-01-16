import { MongoClient, ServerApiVersion, Db, GridFSBucket } from "mongodb";

// Check if the environment variable is set
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true, // allow operations ONLY with serverApi version 1
    deprecationErrors: true, // will return an error for deprecated operations
  },
};

// set the client to be a MongoClient
let client: MongoClient;

export async function connectDB(): Promise<MongoClient> {
  // If the environment is development, use the global object to store the client
  if (process.env.NODE_ENV === "development") {
    // Use the global object to store the client
    let globalWithMongo = global as typeof globalThis & {
      _mongoClient?: MongoClient;
    };

    // Check if the client is already connected
    if (!globalWithMongo._mongoClient) {
      globalWithMongo._mongoClient = new MongoClient(uri, options);
    }
    // Connect to the client
    return globalWithMongo._mongoClient;
  } else {
    // If the environment is not development, create a new client
    client = new MongoClient(uri, options);
  }

  try {
    // Connect to the client
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
  return client.db("foodable_db");
}

export async function setupGridFS(): Promise<GridFSBucket> {
  const db = await getDB();
  const bucket = new GridFSBucket(db, {
    bucketName: "images",
  });
  console.log("== GridFS setup complete");
  return bucket;
}
