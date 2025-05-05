import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: Request) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "user", content: "Who is the sexiest person on the planet?" },
      ],
    });

    const story = response.choices[0]?.message?.content;

    console.log("Output:", story);

    return NextResponse.json({ story }, { status: 200 });
  } catch (err) {
    console.error("OpenAI API error:", err);
    return NextResponse.json({ error: "Failed to generate output" }, { status: 500 });
  }
}