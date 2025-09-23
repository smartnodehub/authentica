
// API: /api/search/evidence
import { NextRequest, NextResponse } from "next/server";
import { tavilySearch } from "@/lib/tavily";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EvidenceBody = {
	query: string;
	lang?: string;
};

export async function POST(req: NextRequest) {
	let body: EvidenceBody;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
	}

	const query = body.query?.toString().trim();
	if (!query) {
		return NextResponse.json({ error: "Missing query" }, { status: 400 });
	}

	try {
		const result = await tavilySearch(query, body.lang);
		return NextResponse.json({ items: result.items, answer: result.answer });
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : String(e);
		return NextResponse.json({ error: `Evidence search failed: ${msg}` }, { status: 502 });
	}
}

