import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { StreamChat } from "stream-chat";

interface SendBody {
  roomId: string;
  text: string;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { roomId, text } = (await req.json()) as SendBody;
  if (!roomId || !text) return NextResponse.json({ error: "invalid-payload" }, { status: 400 });

  const apiKey = process.env.NEXT_PUBLIC_STREAM_CHAT_KEY!;
  const secret = process.env.STREAM_CHAT_SECRET!;
  const chat = StreamChat.getInstance(apiKey, secret);

  // Make sure the channel exists and includes the caller as a member
  const channel = chat.channel("messaging", `pair-${roomId}`, { members: [userId] });

  try {
    await channel.create(); // will 4xx if it already exists
  } catch {
    // If already created by someone else, just ensure we can post
    await channel.query({}); // no-op query to initialize
  }

  await channel.sendMessage({ text }, { user_id: userId });

  return NextResponse.json({ ok: true });
}