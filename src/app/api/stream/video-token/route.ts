import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const apiKey = process.env.VITE_STREAM_VIDEO_API_KEY;
  const apiSecret = process.env.STREAM_VIDEO_API_SECRET;
  if (!apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Missing VITE_STREAM_VIDEO_API_KEY or STREAM_VIDEO_API_SECRET" },
      { status: 500 }
    );
  }

  const client = new StreamClient(apiKey, apiSecret);
  await client.upsertUsers([{ id: userId }]);
  const token = client.generateUserToken({ user_id: userId, validity_in_seconds: 3600 });

  return NextResponse.json({ token, apiKey });
}