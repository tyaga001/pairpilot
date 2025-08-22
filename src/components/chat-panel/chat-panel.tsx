"use client";

import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat, Channel, ChannelHeader, Window, MessageList, MessageInput, Thread, TypingIndicator,
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

interface ChatPanelProps { roomId: string }

export function ChatPanel({ roomId }: ChatPanelProps) {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetch("/api/stream/chat-token", { method: "POST" });
      if (!res.ok) return;
      const { token, apiKey, userId } = await res.json();
      const c = StreamChat.getInstance(apiKey);
      await c.connectUser({ id: userId }, token);

      const ch = c.channel("messaging", `pair-${roomId}`, { members: [userId] });
      await ch.watch();

      if (mounted) { setClient(c); setChannel(ch); }
    })();
    return () => { mounted = false; client?.disconnectUser(); };
  }, [roomId]);

  if (!client || !channel) return <div className="p-2 text-sm text-muted-foreground">Connecting chat…</div>;

  return (
    <Chat client={client}>
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <TypingIndicator />
          <MessageInput focus />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}

export default ChatPanel;