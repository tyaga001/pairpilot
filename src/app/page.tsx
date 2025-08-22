import Link from "next/link";
import { randomBytes } from "crypto";

function id(): string {
  return randomBytes(6).toString("base64url").slice(0, 8);
}

export default function HomePage() {
  const roomId = id();
  return (
    <main className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold">PairPilot</h1>
      <p className="mt-2 text-muted-foreground max-w-prose">
        1-click pair programming with Stream video + chat and instant CodeRabbit PR reviews.
      </p>

      <div className="mt-6 flex gap-3">
        <Link
          href={`/r/${roomId}/prejoin`}
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Start pairing
        </Link>
        <Link
          href="/sign-in"
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}