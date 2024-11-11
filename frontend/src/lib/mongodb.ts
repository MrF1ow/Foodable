// import { MongoClient, ServerApiVersion } from "mongodb";

// if (!process.env.MONGODB_URI) {
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
// }

// const uri = process.env.MONGODB_URI;
// const options = {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// };

// let client: MongoClient;

// if (process.env.NODE_ENV === "development") {
//   let globalWithMongo = global as typeof globalThis & {
//     _mongoClient?: MongoClient;
//   };

//   if (!globalWithMongo._mongoClient) {
//     globalWithMongo._mongoClient = new MongoClient(uri, options);
//   }
//   client = globalWithMongo._mongoClient;
// } else {
//   client = new MongoClient(uri, options);
// }

// client
//   .connect()
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Error connecting to MongoDB:", err));

// export default client;

// https://www.mongodb.com/developer/languages/javascript/nextjs-with-mongodb/

import mongoose from "mongoose";

global.mongoose = {
  conn: null,
  promise: null,
}

// The connection function
export async function dbConnect() {
  // If the connection already exists, return it
  if (global.mongoose && global.mongoose.conn) {
    console.log("Using the existing MongoDB connection");
    return global.mongoose.conn;
  } else {
    // If there is no existing connection, create a new one
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("Missing MONGODB_URI environment variable");
    }

    // If the connection promise is not created, create it
    if (!global.mongoose.promise) {
      global.mongoose.promise = mongoose.connect(uri, {
        autoIndex: true,
      }).then((mongoose) => mongoose.connection);
    }

    // Await the connection and store it in global
    try {
      global.mongoose.conn = await global.mongoose.promise;
      console.log("Connected to MongoDB");
      return global.mongoose.conn;
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      throw new Error("Failed to connect to MongoDB");
    }
  }
}

