import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: "test",
    });

    return NextResponse.json({
      surfaces: [],
      damage: [],
      scope: [],
      followUps: [],
      debug: response.output_text,
    });
  } catch (error: any) {
    return NextResponse.json({
      surfaces: [],
      damage: [],
      scope: [],
      followUps: [],
      debug: error?.message || "unknown error",
    });
  }
}
