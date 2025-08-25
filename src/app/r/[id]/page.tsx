"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  StreamVideo, StreamCall, StreamTheme,
  SpeakerLayout, PaginatedGridLayout, CallControls, type Call, StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { getVideoClient } from "@/lib/stream-video";
import { useToast } from "@/components/ui/use-toast";
import dynamic from "next/dynamic";
import { parseAsString, useQueryState } from "nuqs";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const ChatPanel = dynamic(() => import("@/components/chat-panel/chat-panel"), { ssr: false });
const Editor = dynamic(() => import("@/components/editor/editor"), { ssr: false });

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [code, setCode] = useState<string>("// Start coding together…\n");

  const [layout, setLayout] = useQueryState("layout", parseAsString.withDefault("speaker"));
  const [showChat, setShowChat] = useQueryState("chat", parseAsString.withDefault("1"));

  const copyInvite = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;
    await navigator.clipboard.writeText(url);
    toast({
      title: "Invite link copied!",
      description: "Share this link with your pair programming partner.",
    });
  }, [toast]);

  const shareCodeToChat = useCallback(async () => {
    const res = await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomId: id,
        text: "```ts\n" + code + "\n```",
      }),
    });
    if (!res.ok) {
      toast({
        title: "Failed to share code",
        description: "Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Code shared to chat",
        description: "Your code has been posted to the chat.",
      });
    }
  }, [code, id, toast]);

  const onCreatePR = useCallback(async () => {
    const filename = "snippet.ts";
    const res = await fetch("/api/gh/create-pr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: id, filename, content: code }),
    });
    const data = await res.json();

    if (data?.url) {
      toast({
        title: "Pull Request created!",
        description: (
          <div className="space-y-1">
            <p>CodeRabbit will review automatically.</p>
            <a 
              href={data.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
            >
              View PR →
            </a>
          </div>
        ),
      });
      // post the PR link to chat
      await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: id, text: `PR created: ${data.url}` }),
      });
    } else {
      toast({
        title: "PR creation failed",
        description: "Please check your GitHub configuration and try again.",
        variant: "destructive",
      });
    }
  }, [code, id, toast]);

  useEffect(() => {
    if (!user) return;
    const u = { id: user.id, name: user.fullName ?? "User" };
    (async () => {
      const c = await getVideoClient(u);
      setClient(c);
      const callObj = c.call("default", id);
      await callObj.join({ create: true });
      setCall(callObj);
    })();
    return () => { call?.leave().catch(() => {}); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id]);

  if (!client || !call) return <div className="p-8">Joining…</div>;

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <StreamTheme>
          <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-2 py-2">
            <strong>PairPilot</strong><span className="opacity-70">· {id}</span>
            <div className="ml-auto flex items-center gap-2">
              <button className="btn" onClick={copyInvite}>Copy invite</button>
              <button className="btn" onClick={shareCodeToChat}>Share code</button>
              <button className="btn" onClick={() => setLayout("speaker")} disabled={layout === "speaker"}>Speaker</button>
              <button className="btn" onClick={() => setLayout("grid")} disabled={layout === "grid"}>Grid</button>
              <button className="btn" onClick={() => setShowChat(showChat === "1" ? "0" : "1")}>
                {showChat === "1" ? "Hide chat" : "Chat"}
              </button>
              <button className="btn" onClick={onCreatePR}>Create PR</button>
            </div>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_360px] min-h-[calc(100svh-120px)]">
            <div className="flex items-stretch justify-center p-2">
              {layout === "speaker" ? <SpeakerLayout /> : <PaginatedGridLayout />}
            </div>
            <div className="border-l p-2 min-h-0">
              <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading editor…</div>}>
                <Editor roomId={id} value={code} onChange={setCode} />
              </Suspense>
            </div>
            {showChat === "1" && (
              <aside className="border-l p-2">
                <Suspense fallback={<div className="p-2 text-sm text-muted-foreground">Loading chat…</div>}>
                  <ChatPanel roomId={id} />
                </Suspense>
              </aside>
            )}
          </main>

          <footer className="border-t p-2">
            <CallControls onLeave={() => router.push("/")} />
          </footer>
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
}