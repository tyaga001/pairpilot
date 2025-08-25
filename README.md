# PairPilot

> Pair programming that feels instant

![PairPilot Landing Page](https://github.com/user-attachments/assets/pairpilot-landing-page.png)

*Live demo showing video call, code editor, and team chat in action*

**1-click room · video + chat · code threads · recordings**

PairPilot is a modern pair programming platform built with Next.js, Stream Video/Chat SDKs, and Clerk authentication. Start coding together in seconds with integrated video calls, real-time chat, and collaborative code editing.

## ✨ Features

- **Instant Rooms** - One-click room creation with shareable links
- **Video + Audio** - High-quality video calls powered by Stream
- **Real-time Chat** - Threaded conversations with code sharing
- **Code Collaboration** - Monaco editor with live collaboration
- **GitHub Integration** - Create PRs directly from sessions
- **Recording** - Automatic session recording and sharing

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/tyaga001/pairpilot.git
cd pairpilot

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with your Clerk, Stream, and GitHub credentials

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see PairPilot in action.

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: Clerk
- **Video/Audio**: Stream Video SDK
- **Chat**: Stream Chat SDK
- **Styling**: Tailwind CSS + shadcn/ui
- **Code Editor**: Monaco Editor
- **Deployment**: Vercel

## 📝 Environment Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Stream Video & Chat
VITE_STREAM_VIDEO_API_KEY=
STREAM_VIDEO_API_SECRET=
NEXT_PUBLIC_STREAM_CHAT_KEY=
STREAM_CHAT_SECRET=

# GitHub Integration
GITHUB_TOKEN=
PAIRPILOT_TARGET_REPO=
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using [Stream](https://getstream.io), [Clerk](https://clerk.com), and [Next.js](https://nextjs.org)