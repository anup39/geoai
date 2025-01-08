import OpenAI from "openai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    if (!client.apiKey) {
      return new NextResponse("API key is missing", {
        status: 500,
      });
    }
    if (!messages) {
      return new NextResponse("Messages are required", {
        status: 400,
      });
    }

    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Convert natural language to a duckdb spatial query to visualize geospatial data. Only response with a valid query and code ",
        },
        ...messages,
      ],
      model: "gpt-4o-mini",
    });

    return NextResponse.json(response.choices[0].message);
  } catch (e) {
    console.error(e, "internal error");
    return new NextResponse("Internal Error", {
      status: 500,
    });
  }
}
