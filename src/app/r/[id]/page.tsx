"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  StreamVideo, StreamCall, StreamTheme,
  SpeakerLayout, PaginatedGridLayout, CallControls, useCallStateHooks,
  type Call, type StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { getCall, getOrCreateVideoClient } from "@/lib/stream-video";
import "@stream-io/video-react-sdk/dist/css/styles.css";

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  
  const [ctx, setCtx] = useState<{ call: Call; client: StreamVideoClient } | null>(null);
  const [layout, setLayout] = useState<"speaker" | "grid">("speaker");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [call, client] = await Promise.all([
          getCall(id),
          getOrCreateVideoClient()
        ]);
        if (!active) return;
        
        await call.join({ create: true });
        setCtx({ call, client });
      } catch (error) {
        console.error('Failed to join call:', error);
      }
    })();
    return () => { 
      active = false;
      ctx?.call?.leave().catch(() => {});
    };
  }, [id]);

  if (!ctx) return <div className="p-8 text-center">Joining…</div>;

  return (
    <StreamVideo client={ctx.client}>
      <StreamCall call={ctx.call}>
        <StreamTheme>
          <MeetingRoom layout={layout} onLayoutChange={setLayout} />
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
}

function MeetingRoom({ 
  layout, 
  onLayoutChange 
}: { 
  layout: "speaker" | "grid"; 
  onLayoutChange: (layout: "speaker" | "grid") => void;
}) {
  const { useScreenShareState } = useCallStateHooks();
  const screenShare = useScreenShareState();

  // Auto-switch to speaker when someone shares screen
  useEffect(() => {
    if (screenShare.hasScreenShare) {
      onLayoutChange("speaker");
    }
  }, [screenShare.hasScreenShare, onLayoutChange]);

  return (
    <div className="h-screen grid grid-cols-12 grid-rows-[1fr_auto]">
      {/* Video Stage - 9 columns */}
      <div className="col-span-9 bg-gray-900 flex items-center justify-center">
        {layout === "speaker" ? <SpeakerLayout /> : <PaginatedGridLayout />}
      </div>

      {/* Side Panel - 3 columns */}
      <div className="col-span-3 bg-gray-50 border-l flex items-center justify-center">
        <p className="text-gray-600">Chat coming soon…</p>
      </div>

      {/* Footer - Full width */}
      <div className="col-span-12 bg-white border-t p-4 flex items-center justify-between">
        <CallControls />
        <div className="flex gap-2">
          <button
            onClick={() => onLayoutChange("speaker")}
            className={`px-3 py-1 rounded text-sm ${
              layout === "speaker" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Speaker
          </button>
          <button
            onClick={() => onLayoutChange("grid")}
            className={`px-3 py-1 rounded text-sm ${
              layout === "grid" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Grid
          </button>
        </div>
      </div>
    </div>
  );
}