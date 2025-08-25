// src/lib/stream-video.ts
"use client";

import { StreamVideoClient, type Call, type User } from "@stream-io/video-react-sdk";

let clientSingleton: StreamVideoClient | null = null;

async function fetchVideoToken() {
  const r = await fetch("/api/stream/video-token", { method: "POST" });
  if (!r.ok) throw new Error(`video token: ${r.status}`);
  return r.json() as Promise<{ token: string; apiKey: string }>;
}

export async function getOrCreateVideoClient(): Promise<StreamVideoClient> {
  if (clientSingleton) return clientSingleton;
  const { token, apiKey } = await fetchVideoToken();
  clientSingleton = new StreamVideoClient({ apiKey, user: { id: "me" }, token });
  return clientSingleton;
}

export async function getVideoClient(user: User): Promise<StreamVideoClient> {
  // For now, we'll use the singleton approach but could be enhanced to support multiple users
  if (clientSingleton) return clientSingleton;
  const { token, apiKey } = await fetchVideoToken();
  clientSingleton = new StreamVideoClient({ apiKey, user, token });
  return clientSingleton;
}

export async function getCall(roomId: string): Promise<Call> {
  const client = await getOrCreateVideoClient();
  return client.call("default", roomId);
}