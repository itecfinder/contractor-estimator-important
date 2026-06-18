import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    keyExists: !!process.env.OPENAI_API_KEY,
    keyLength: process.env.OPENAI_API_KEY?.length || 0,
    keyPrefix: process.env.OPENAI_API_KEY?.slice(0, 12),
  });
}
