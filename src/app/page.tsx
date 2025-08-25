import type { Metadata } from "next";
import HomePage from "./home-page";

export const metadata: Metadata = {
  title: "PairPilot - Pair programming that feels instant",
  description: "1-click room · video + chat · code threads · recordings. The fastest way to start pair programming with your team.",
  keywords: ["pair programming", "collaborative coding", "video chat", "code review", "remote development"],
  authors: [{ name: "PairPilot Team" }],
  openGraph: {
    title: "PairPilot - Pair programming that feels instant",
    description: "1-click room · video + chat · code threads · recordings",
    type: "website",
    url: "https://pairpilot.dev",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PairPilot - Pair programming interface with video, chat, and code editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PairPilot - Pair programming that feels instant",
    description: "1-click room · video + chat · code threads · recordings",
    images: ["/og-image.png"],
  },
};

export default function Page() {
  return <HomePage />;
}