import { getDB } from "@/lib/mongodb";
import { getEmbedding } from "@/lib/utils/get-embeddings";
import { NextResponse } from "next/server";
import { getValueFromSearchParams } from "@/lib/utils/routeHelpers"

function normalize(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map((val) => val / norm);
}

const data: any[] = [
  {
    "title": "Chocolate sauce",
    "description": "A rich and moist chocolate cake perfect for any occasion.",
    "ingredients": [
        {
            "name": "Flour",
            "quantity": 2,
            "unit": "cup",
            "category": "Bakery"
        },
        {
            "name": "Sugar",
            "quantity": 1,
            "unit": "cup",
            "category": "Bakery"
        },
        {
            "name": "Cocoa Powder",
            "quantity": 0.5,
            "unit": "cup",
            "category": "Bakery"
        },
        {
            "name": "Eggs",
            "quantity": 2,
            "unit": "pcs",
            "category": "Dairy"
        }
    ],
    "instructions": [
        "Preheat the oven to 350°F (175°C).",
        "Mix the dry ingredients in a large bowl.",
        "Add wet ingredients and mix until smooth.",
        "Pour the batter into a greased baking pan.",
        "Bake for 30-35 minutes or until a toothpick comes out clean."
    ],
},
{
  "title": "Blueberry Muffins",
  "description": "Soft and fluffy muffins packed with fresh blueberries.",
  "ingredients": [
      {
          "name": "Flour",
          "quantity": 2,
          "unit": "cup",
          "category": "Bakery"
      },
      {
          "name": "Sugar",
          "quantity": 1,
          "unit": "cup",
          "category": "Bakery"
      },
      {
          "name": "Blueberries",
          "quantity": 1.5,
          "unit": "cup",
          "category": "Produce"
      },
      {
          "name": "Eggs",
          "quantity": 2,
          "unit": "pcs",
          "category": "Dairy"
      },
      {
          "name": "Milk",
          "quantity": 0.5,
          "unit": "cup",
          "category": "Dairy"
      }
  ],
  "instructions": [
      "Preheat the oven to 375°F (190°C).",
      "Mix the dry ingredients in a large bowl.",
      "Add wet ingredients and mix until just combined.",
      "Gently fold in the blueberries.",
      "Scoop batter into a lined muffin tin.",
      "Bake for 20-25 minutes or until a toothpick comes out clean."
  ],
}

]
export async function GET(request: Request) {
  try {
    const db = await getDB();
    const collection = db.collection("vectors");
    const userQuery = getValueFromSearchParams(request, "q");

    const queryEmbedding = await getEmbedding(userQuery);
    if (!queryEmbedding) {
      return NextResponse.json(
        { error: "Failed to generate embedding for query." },
        { status: 500 }
      );
    }
    const normalizedQuery = normalize(queryEmbedding);
    console.log("normalized query: ", normalizedQuery)
    console.log("query: ", queryEmbedding)

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
          data: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ];

    const results = [];
    const cursor = collection.aggregate(pipeline);
    for await (const doc of cursor) {
      results.push(doc);
    }


    return NextResponse.json(
      {
        query: userQuery,
        result: results,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Vector search error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST() {
  try {
          const db = await getDB()
          const collection = db.collection("vectors")
  
          console.log("Generating embeddings and inserting documents...");
          const insertDocuments: { data: any, embedding: number[] }[] = [];
  
          await Promise.all(data.map(async (data: any) => {
              const existingDoc = await collection.findOne({ data });
  
              let embedding = await getEmbedding(JSON.stringify(data)) as number[];
  
              // Optional BSON conversion
              // const bsonEmbedding = await convertEmbeddingsToBSON([embedding]);
              // embedding = bsonEmbedding[0];
  
              if (!existingDoc) {
                  insertDocuments.push({ data, embedding });
              }
          }));
  
          const options = { ordered: false };
          const result = await collection.insertMany(insertDocuments, options);
          return NextResponse.json(
            {
              count: result.insertedCount,
            },
            { status: 200 }
          );
  
      } catch (err) {
          console.error(err);
      }
}
