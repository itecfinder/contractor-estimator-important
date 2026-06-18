import OpenAI from "openai";
import { NextResponse } from "next/server";
export async function POST() {
  return NextResponse.json({
    keyExists: !!process.env.OPENAI_API_KEY,
    keyLength: process.env.OPENAI_API_KEY?.length || 0,
    keyPrefix: process.env.OPENAI_API_KEY?.slice(0, 12),
  });
}

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
