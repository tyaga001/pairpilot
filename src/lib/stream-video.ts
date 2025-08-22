"use client";

import { StreamVideoClient, type User } from "@stream-io/video-react-sdk";

let cached: { client: StreamVideoClient; userId: string } | null = null;

export async function getVideoClient(user: User): Promise<StreamVideoClient> {
  if (cached?.client && cached.userId === user.id) return cached.client;

  const res = await fetch("/api/stream/video-token", { method: "POST" });
  if (!res.ok) throw new Error("video token fetch failed");
  const { token, apiKey } = (await res.json()) as { token: string; apiKey: string };

  const client = new StreamVideoClient({
    apiKey,
    user,
    tokenProvider: async () => token,
  });

  cached = { client, userId: user.id };
  return client;
}