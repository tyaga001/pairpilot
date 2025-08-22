"use client";

import { ClerkProvider } from "@clerk/nextjs";
import type { ReactNode } from "react";
import "@/app/globals.css";

interface RootLayoutProps { children: ReactNode }

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-background text-foreground antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}