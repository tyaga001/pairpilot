import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { StreamChat } from "stream-chat";

export async function POST() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const apiKey = process.env.NEXT_PUBLIC_STREAM_CHAT_KEY!;
  const secret = process.env.STREAM_CHAT_SECRET!;
  const server = StreamChat.getInstance(apiKey, secret);

  await server.upsertUser({ id: userId });
  const token = server.createToken(userId, Math.floor(Date.now() / 1000) + 3600);

  return NextResponse.json({ token, userId, apiKey });
}   