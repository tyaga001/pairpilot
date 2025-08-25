import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createPullRequest } from "@/lib/github";

interface Payload { roomId: string; filename: string; content: string }

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json()) as Payload;
  const repo = process.env.PAIRPILOT_TARGET_REPO!; // e.g., "tyaga001/pairpilot-playground"
  const token = process.env.GITHUB_TOKEN!;
  const [owner, name] = repo.split("/");

  try {
    const result = await createPullRequest({
      owner, repo: name, token,
      roomId: body.roomId,
      filename: body.filename,
      content: body.content,
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "failed" }, { status: 500 });
  }
}