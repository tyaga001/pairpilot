"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamTheme, CallPreview } from "@stream-io/video-react-sdk";
import { getVideoClient } from "@/lib/stream-video";
import "@stream-io/video-react-sdk/dist/css/styles.css";

export default function PrejoinPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const router = useRouter();

  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const u = { id: user.id, name: user.fullName ?? "User" };
    getVideoClient(u).then(setClient);
  }, [user]);

  if (!client) return <div className="p-8">Loading…</div>;

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <div className="max-w-xl mx-auto p-6">
          <h1 className="text-xl font-semibold mb-3">Ready to join?</h1>
          <CallPreview onJoin={() => router.push(`/r/${id}`)} />
        </div>
      </StreamTheme>
    </StreamVideo>
  );
}