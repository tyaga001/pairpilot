"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StartPairingButton from "@/components/start-pairing-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Code2, 
  Video, 
  MessageSquare, 
  Users, 
  Share2, 
  Play,
  Star,
  Github,
  Zap,
  UserCheck,
  Keyboard,
  Circle,
  Eye
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      router.push(`/r/${roomCode.trim()}/prejoin`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Sticky Utility Bar */}
      <div className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-bold text-lg">PairPilot</Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <a href="https://github.com/tyaga001/pairpilot" target="_blank" rel="noopener noreferrer">
                <Star className="w-4 h-4 mr-1" />
                Star
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="/docs" target="_blank" rel="noopener noreferrer">
                Docs
              </a>
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Pair programming that feels{" "}
            <span className="text-primary">instant</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            1-click room · video + chat · code threads · recordings
          </p>

          {/* Primary CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <StartPairingButton />
            
            <form onSubmit={handleJoinRoom} className="flex gap-2">
              <Input
                placeholder="Enter room code"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-40"
              />
              <Button type="submit" variant="outline">
                Join
              </Button>
            </form>

            <Button variant="ghost" asChild>
              <Link href="/sign-in">
                <Github className="w-4 h-4 mr-2" />
                Sign in with GitHub
              </Link>
            </Button>
          </div>

          {/* Live Demo */}
          <div className="max-w-4xl mx-auto mb-20">
            <div className="relative rounded-lg border bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 p-2 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              <div className="relative rounded-md overflow-hidden bg-white dark:bg-gray-900 group">
                {/* Demo mockup showing video + chat + code */}
                <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex">
                  {/* Video section */}
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="bg-black rounded-lg flex-1 relative overflow-hidden">
                      <div className="absolute inset-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <div className="text-white text-center">
                          <Video className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                          <p className="text-sm font-medium">Live Video Call</p>
                          <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mt-1 animate-pulse"></div>
                        </div>
                      </div>
                      {/* Participant thumbnails */}
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <div className="w-16 h-12 bg-green-500 rounded flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-16 h-12 bg-blue-500 rounded flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                    {/* Controls */}
                    <div className="flex justify-center gap-2 mt-3">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Code editor section */}
                  <div className="flex-1 p-4 pl-2">
                    <div className="bg-gray-900 rounded-lg h-full p-4 font-mono text-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-400 ml-2">pair-session.tsx</span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="text-purple-400">function <span className="text-yellow-300">pairProgram</span>() &#123;</div>
                        <div className="text-gray-400 ml-4">// Real-time collaboration</div>
                        <div className="text-blue-400 ml-4">const <span className="text-white">session</span> = <span className="text-green-400">&apos;active&apos;</span>;</div>
                        <div className="text-blue-400 ml-4">return <span className="text-red-400">&lt;PairPilot /&gt;</span>;</div>
                        <div className="text-purple-400">&#125;</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chat section */}
                  <div className="w-64 p-4 pl-2">
                    <div className="bg-white dark:bg-gray-800 rounded-lg h-full p-3 border">
                      <div className="text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">Team Chat</div>
                      <div className="space-y-2 text-xs">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded">
                          <div className="font-medium text-blue-900 dark:text-blue-100">Alice</div>
                          <div className="text-blue-800 dark:text-blue-200">Let&apos;s refactor this function</div>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                          <div className="font-medium text-gray-900 dark:text-gray-100">Bob</div>
                          <div className="text-gray-800 dark:text-gray-200">Good idea! 👍</div>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
                          <div className="font-medium text-green-900 dark:text-green-100">You</div>
                          <div className="text-green-800 dark:text-green-200">```js
const result = optimize();</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      ✨ Live Demo: Start room → Copy invite → Code together → Chat threads
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Bullets */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need for pair programming
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <UserCheck className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Driver/Navigator badges</h3>
                <p className="text-muted-foreground">Clear roles with visual indicators for who&apos;s driving and navigating</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Share2 className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Share selection → chat thread</h3>
                <p className="text-muted-foreground">Highlight code and instantly create discussion threads</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Zap className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Slash commands</h3>
                <p className="text-muted-foreground">/timer 25, /handoff @you - Quick actions via chat</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Circle className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Recording + auto-share</h3>
                <p className="text-muted-foreground">Automatic session recording with instant shareable links</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Eye className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Follow presenter + PiP</h3>
                <p className="text-muted-foreground">Picture-in-picture mode and presenter following</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Keyboard className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Keyboard shortcuts</h3>
                <p className="text-muted-foreground">m, v, s, g, c, p - Navigate without lifting your hands</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 bg-muted/30 rounded-2xl">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Create room</h3>
              <p className="text-muted-foreground">Click &quot;Start pairing&quot; to instantly create a new room</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Share invite</h3>
              <p className="text-muted-foreground">Copy the room link and send it to your pair programming partner</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Code together</h3>
              <p className="text-muted-foreground">Start coding with video, chat, and real-time collaboration</p>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Powered by industry leaders</h2>
          <p className="text-muted-foreground mb-8">Built with the same technology trusted by millions</p>
          
          {/* Inspired by Stream's "Loved by Developers at" section */}
          <div className="flex flex-wrap justify-center items-center gap-8 mb-12 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Stream</div>
            <div className="text-2xl font-bold text-gray-400">Clerk</div>
            <div className="text-2xl font-bold text-gray-400">Next.js</div>
            <div className="text-2xl font-bold text-gray-400">Vercel</div>
            <div className="text-2xl font-bold text-gray-400">OpenAI</div>
          </div>

          <h3 className="text-xl font-semibold mb-6">Built with modern tech</h3>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <Badge variant="secondary">MIT License</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Next.js 15</Badge>
            <Badge variant="secondary">
              <a href="https://getstream.io/video/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                Stream Video
              </a>
            </Badge>
            <Badge variant="secondary">
              <a href="https://getstream.io/chat/sdk/react/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                Stream Chat
              </a>
            </Badge>
            <Badge variant="secondary">Clerk Auth</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
          </div>
          <div className="flex justify-center">
            <Button variant="outline" asChild>
              <a href="https://github.com/tyaga001/pairpilot" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="font-bold">PairPilot</span>
              <a 
                href="https://opensource.org/licenses/MIT" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                MIT License
              </a>
              <span className="text-muted-foreground text-sm">No tracking, privacy-first</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                <Video className="w-4 h-4" />
                <MessageSquare className="w-4 h-4" />
                <Users className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
