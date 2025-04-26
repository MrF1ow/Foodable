import { MongoClient } from 'mongodb';
import { getDB } from '../mongodb';

// connect to your Atlas deployment
async function run() {
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
  } catch {
    Error("error")
  }
}
run().catch(console.dir);
