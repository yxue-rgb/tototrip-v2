# TOTO Trip V2 - AI Travel Companion for China

A modern, AI-powered travel companion specifically designed for foreign travelers visiting China. Built with Next.js 15, Claude AI, and featuring real-time streaming responses.

## ✨ Features

- **🤖 AI Chat Companion**: Real-time streaming responses powered by Claude 3.5 Sonnet
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS and shadcn/ui
- **⚡ Fast**: Built on Next.js 15 with Turbopack
- **📱 Mobile-Friendly**: Optimized for both desktop and mobile devices
- **🌍 China-Focused**: Specialized knowledge for traveling in China

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- An Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
v2/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Claude AI streaming API
│   ├── chat/
│   │   ├── components/
│   │   │   ├── MessageList.tsx   # Chat message display
│   │   │   └── MessageInput.tsx  # Message input component
│   │   └── [id]/
│   │       └── page.tsx          # Chat page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── components/
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── utils.ts                  # Utility functions
│   └── env.ts                    # Environment variables
└── public/                       # Static assets
```

## 🎯 Key Improvements Over V1

### Architecture
- ✅ **Simplified**: No GraphQL, no separate backend
- ✅ **All-in-one**: Next.js handles both frontend and API
- ✅ **Cost-effective**: Reduced infrastructure complexity

### AI Experience
- ✅ **Streaming responses**: See AI answers appear in real-time
- ✅ **Faster perceived performance**: No more waiting for complete responses
- ✅ **Better UX**: Typing indicators and smooth animations

### UI/UX
- ✅ **Modern design**: Clean, professional interface
- ✅ **Mobile-optimized**: Works great on all devices
- ✅ **Engaging homepage**: Clear value proposition
- ✅ **Quick actions**: Pre-defined prompts for common queries

## 🛠 Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **AI**: Claude 3.5 Sonnet (Anthropic API)
- **Animations**: Framer Motion
- **Markdown**: react-markdown with remark-gfm

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (for future features) | No |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | No |

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add the `ANTHROPIC_API_KEY` environment variable
4. Deploy!

### Other Platforms

This is a standard Next.js app and can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 🔮 Future Enhancements

- [ ] Supabase integration for trip persistence
- [ ] User authentication
- [ ] Itinerary saving and sharing
- [ ] Photo translation feature
- [ ] Offline mode
- [ ] Multi-language support
- [ ] Voice input/output
- [ ] Integration with mapping services

## 💰 Cost Estimation

With Claude API's pricing:
- Input: $3 per million tokens
- Output: $15 per million tokens

Typical conversation (50 messages):
- ~25,000 tokens
- Cost: ~$0.15-0.50 per conversation

For 1000 users/month with 3 conversations each:
- ~$500-1500/month in AI costs
- Much cheaper than maintaining separate backend infrastructure

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! This is a simplified version designed for rapid iteration.

## 🙋 Support

For questions or issues, please open an issue on GitHub.

---

Built with ❤️ for travelers exploring China
