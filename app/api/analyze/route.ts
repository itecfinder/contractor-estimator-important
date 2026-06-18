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
      surfaces: [
        {
          label: response.output_text,
          area: 1,
          unit: "sq ft",
          confidence: 1,
        },
      ],
      damage: [],
      scope: [],
      followUps: [],
    });
  } catch (error: any) {
    return NextResponse.json({
      surfaces: [
        {
          label: error?.message || "unknown error",
          area: 0,
          unit: "",
          confidence: 0,
        },
      ],
      damage: [],
      scope: [],
      followUps: [],
    });
  }
}
