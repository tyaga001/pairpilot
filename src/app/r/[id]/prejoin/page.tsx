// src/app/r/[id]/prejoin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  StreamVideo, StreamCall, StreamTheme,
  CallPreview, DeviceSettings, useCallStateHooks,
  CallControls, useCall,
  type Call, type StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { getCall, getOrCreateVideoClient } from "@/lib/stream-video";

export default function PrejoinPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [ctx, setCtx] = useState<{ call: Call; client: StreamVideoClient } | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [call, client] = await Promise.all([
          getCall(id),
          getOrCreateVideoClient()
        ]);
        if (!active) return;
        setCtx({ call, client });
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Failed to init video");
      } finally {
        setIsLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id]);

  if (isLoading) return <div className="p-8 text-center">Loading…</div>;
  if (err || !ctx) return <div className="p-8 text-center text-red-500">Failed to initialize video: {err}</div>;

  return (
    <StreamVideo client={ctx.client}>
      <StreamCall call={ctx.call}>
        <StreamTheme>
          <PrejoinInner onJoin={() => router.push(`/r/${id}`)} />
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
}

function PrejoinInner({ onJoin }: { onJoin: () => void }) {
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const mic = useMicrophoneState();
  const cam = useCameraState();
  const call = useCall();

  async function join() {
    try {
      // Enable camera and microphone if available
      if (cam.camera) await cam.camera.enable();
      if (mic.microphone) await mic.microphone.enable();
      
      // Join the call
      if (call) await call.join({ create: true });
    } catch (error) {
      console.warn('Failed to enable devices or join call:', error);
    }
    onJoin();
  }

  // Save call reference for devtools / fallback
  if (typeof window !== 'undefined' && call) {
    (window as typeof window & { streamCall?: Call }).streamCall = call;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-center text-xl font-semibold">Ready to join?</h1>

      <div className="rounded-lg border p-4">
        <CallPreview />
      </div>

      <div className="rounded-lg border p-4">
        <DeviceSettings />
      </div>

      <div className="flex items-center justify-center gap-3">
        <CallControls />
        <button
          onClick={join}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
        >
          Join now
        </button>
      </div>
    </div>
  );
}