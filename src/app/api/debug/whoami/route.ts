import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  return NextResponse.json({ 
    userId: userId || null,
    authenticated: !!userId 
  });
}

export async function POST() {
  const { userId } = await auth();
  return NextResponse.json({ 
    userId: userId || null,
    authenticated: !!userId 
  });
}
