import { NextResponse } from "next/server";
import crypto from "crypto";
import { StreamChat } from "stream-chat";

function verify(sig: string | null, secret: string, body: string): boolean {
  if (!sig) return false;
  const h = crypto.createHmac("sha256", secret);
  const digest = `sha256=${h.update(body).digest("hex")}`;
  // constant-time compare
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(sig));
}

export async function POST(req: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET!;
  const sig = req.headers.get("x-hub-signature-256");
  const event = req.headers.get("x-github-event");
  const text = await req.text();

  if (!verify(sig, secret, text)) return NextResponse.json({ error: "bad signature" }, { status: 401 });

  const payload = JSON.parse(text);

  // Handle PR review submitted (CodeRabbit posts as a review)
  if (event === "pull_request_review" && payload.action === "submitted") {
    const headRef: string = payload.pull_request?.head?.ref ?? "";
    const match = headRef.match(/^pairpilot\/([^/-]+)/);
    const roomId = match?.[1];
    if (!roomId) return NextResponse.json({ ok: true });

    const body: string = payload.review?.body ?? "(no content)";
    const reviewer: string = payload.review?.user?.login ?? "reviewer";

    // Post to Stream Chat channel "pair-<roomId>"
    const apiKey = process.env.NEXT_PUBLIC_STREAM_CHAT_KEY!;
    const secretChat = process.env.STREAM_CHAT_SECRET!;
    const chat = StreamChat.getInstance(apiKey, secretChat);
    await chat.upsertUser({ id: "bot", name: "PairPilot Bot" });
    const channel = chat.channel("messaging", `pair-${roomId}`);
    await channel.create();

    await channel.sendMessage(
      { text: `**New code review by @${reviewer}:**\n\n${body}` },
      { user_id: "bot" }
    );
  }

  return NextResponse.json({ ok: true });
}