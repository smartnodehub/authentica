import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body;

    // Mockitud vastus (saab kohe UI-s testida)
    const fakeResponse = {
      label: "likely_ai", // või "likely_human" / "mixed"
      score: 0.82, // 82%
      reasons: [
        "Repetitive sentence structures",
        "Unusually high perplexity variance",
        "No personal context or style markers",
      ],
      inputLength: text?.length || 0,
    };

    return NextResponse.json(fakeResponse);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Detection failed" },
      { status: 500 }
    );
  }
}