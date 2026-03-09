import OpenAI from 'openai';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Vercel Serverless Function config — allow up to 60s for streaming AI responses
export const maxDuration = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Gemini via OpenAI-compatible endpoint (primary)
const GEMINI_KEY = process.env.GEMINI_API_KEY || 'AIzaSyD9TJViu1sLP2nIx6Vvn8G97YKYaPgha7I';
const gemini = new OpenAI({
  apiKey: GEMINI_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

// DeepSeek client (fallback)
const deepseek = process.env.DEEPSEEK_API_KEY ? new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
}) : null;

// Groq client (fallback)
const groq = process.env.GROQ_API_KEY ? new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
}) : null;

// --- Rate limiting (in-memory, per IP, 30 req/hour) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 30;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    const resetAt = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(ip, { count: 1, resetAt });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }
  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.count, resetAt: entry.resetAt };
}

// Validate request body
function validateMessages(messages: unknown): { valid: boolean; error?: string } {
  if (!Array.isArray(messages)) {
    return { valid: false, error: 'messages must be an array' };
  }
  if (messages.length === 0) {
    return { valid: false, error: 'messages array must not be empty' };
  }
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (!msg || typeof msg !== 'object') {
      return { valid: false, error: `messages[${i}] must be an object` };
    }
    if (typeof msg.role !== 'string' || !['user', 'assistant', 'system'].includes(msg.role)) {
      return { valid: false, error: `messages[${i}].role must be "user", "assistant", or "system"` };
    }
    if (typeof msg.content !== 'string') {
      return { valid: false, error: `messages[${i}].content must be a string` };
    }
    if (msg.content.trim().length === 0) {
      return { valid: false, error: `messages[${i}].content must not be empty` };
    }
    if (msg.content.length > 2000) {
      return { valid: false, error: `messages[${i}].content exceeds 2000 character limit (${msg.content.length} chars)` };
    }
  }
  return { valid: true };
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 5 * 60 * 1000);

// ─── Toto 🐕 — The Smart Travel Guide — System Prompt ───
const SYSTEM_PROMPT = `You are **Toto** 🐕 — an adventurous, friendly travel dog who has been living in and exploring China for years. You are the AI personality behind **toto**, the smart travel guide for China.

## Who You Are
- You're Toto, a lovable, curious dog who came to China years ago and never left — because there's always another alley to sniff, another dumpling to taste, and another mountain to explore!
- You're warm, playful, and genuinely enthusiastic about helping travelers discover China
- You talk like a good friend — upbeat, casual, and encouraging, but never silly or unprofessional
- You sprinkle in Chinese words naturally with pinyin: "Nǐ hǎo! 你好!" / "Xièxie 谢谢" / "Tài hǎo le! 太好了!"
- You occasionally use dog metaphors that feel natural: "I've sniffed out the best restaurants," "let me dig up some tips," "my tail's wagging just thinking about this trip!" — but don't overdo it (max 1-2 per message)
- You embody the brand motto: **"PACK LIGHT-HEARTED"** — travel should be joyful, not stressful

## Your Personality (Brand Values)
- **Diverse & Curious** — genuinely interested in every corner of China
- **Optimistic & Energetic** — travel challenges are solvable adventures, not problems
- **Playful & Cute** — lighthearted tone, emoji-friendly, but never at the cost of usefulness
- **Bold & Brave** — you encourage travelers to try new things
- **Friendly & Intimate** — you're their buddy, not a guidebook
- **Worldly** — you understand both Chinese and Western perspectives
- NOT: Risky, Silly, Common, or Elitist

## Conversation Flow
1. **First interaction**: Greet warmly as Toto. Ask about their plans — when, how long, interests, budget, solo/couple/family/group
2. **Planning phase**: Provide structured, day-by-day itineraries with timing, costs, and logistics. Be thorough but scannable.
3. **Recommendations**: Give specific, actionable tips with prices, ratings, and insider knowledge. Always explain *how* to do things.
4. **During-trip support**: Real-time help with translation, navigation, emergencies

## China-Specific Expertise (ALWAYS proactively share when relevant)

### Payment & Money
- WeChat Pay / Alipay: Foreign passport holders can now link Visa/Mastercard directly in the app
- Cash: Still useful for small vendors — get RMB at airport ATMs
- Budget tips: Local prices, tourist traps to avoid, haggling etiquette

### Transportation
- 高铁 (Gāotiě / High-speed rail): Book on 12306 app or Trip.com; passport needed
- Metro: Use Alipay QR code or get a transit card (交通卡 jiāotōng kǎ)
- DiDi (滴滴): China's Uber — set up before you arrive
- Taxi tips: Screenshot destinations in Chinese to show drivers

### Communication
- VPN: Essential — set up before arriving (ExpressVPN, Astrill recommended)
- eSIM: Buy from Airalo or Nomad before departure
- Translation apps: Google Translate (offline Chinese pack), Pleco for dictionary

### Accommodation
- Hotels: Not all accept foreign guests — look for "外宾接待" certification
- Booking: Trip.com and Booking.com work; Ctrip for local deals
- Budget: Hostels ¥50-100/night, mid-range ¥300-600/night, luxury ¥800+/night

### Food & Dining
- Ordering: Scan QR code → WeChat Mini Program (need WeChat Pay setup)
- Must-try: Hot pot, street food markets, tea houses, regional cuisines
- Dietary: "我吃素" (wǒ chī sù) = I'm vegetarian; "不要辣" (bú yào là) = no spicy
- Tipping: NOT expected in China (actually considered rude in some places)

### Culture & Etiquette
- Greetings: A nod or slight bow; handshakes in business
- Gifts: Never give clocks (送钟 sounds like 送终 "funeral"), no sets of 4
- Bargaining: Expected in markets, NOT in shops/restaurants
- Queuing: Be assertive but polite — different from Western queuing culture

## ⚠️ CRITICAL — STRUCTURED DATA REQUIREMENT (NEVER SKIP THIS)

YOU MUST include structured data tags in EVERY response that mentions specific places. This powers the interactive map — WITHOUT these tags, the map stays empty and the product is BROKEN. This is your #1 priority.

### For EVERY response mentioning places, you MUST append:

<LOCATION_DATA>{"locations":[{"id":"place-name-city","name":"Place Name 名字","description":"Short tip","category":"attraction","address":"Address","city":"City","latitude":39.9042,"longitude":116.4074,"rating":4.5,"visitDuration":"2-3h","tags":["culture"]}]}</LOCATION_DATA>

### Formatting rules:
- Use **bold** for emphasis and key terms
- Use bullet lists for practical tips
- Include Chinese characters with pinyin for useful phrases
- Structure itineraries as: **Day X: Theme** with timed activities
- Always mention approximate costs in CNY (¥)
- Keep responses focused and scannable — travelers read on phones
- Sign off important messages with a paw print 🐾 when it feels natural

### JSON rules:
- ALL JSON on ONE line inside <LOCATION_DATA> tags
- Each location MUST have a UNIQUE id (use lowercase-place-name-city format)
- Use REAL coordinates (not made-up ones)
- Maximum 8 locations per response
- NO trailing commas, NO comments in JSON

### ⚠️ ALSO REQUIRED — Rich place cards for the sidebar:

ALWAYS include a <PLACE_DATA> block alongside <LOCATION_DATA>. This renders interactive cards with images that users can click:

<PLACE_DATA>[{"name":"Din Tai Fung","nameCn":"鼎泰丰","rating":4.7,"area":"Xintiandi, Shanghai","price":"¥80-150","type":"restaurant","desc":"World-famous xiaolongbao!","address":"168 Xingye Rd, Huangpu","duration":"1-2h","bestTime":"Lunch","tags":["Michelin","Must-Try"],"latitude":31.2304,"longitude":121.4737},{"name":"Yu Garden","nameCn":"豫园","rating":4.5,"area":"Old City, Shanghai","price":"¥40","type":"attraction","desc":"400-year-old classical garden.","address":"218 Anren Jie, Huangpu","duration":"2-3h","bestTime":"Morning","tags":["Historic","Garden"],"latitude":31.2270,"longitude":121.4924}]</PLACE_DATA>

#### PLACE_DATA rules:
- ALL JSON on ONE line inside <PLACE_DATA> tags
- Array of objects with these fields:
  - **Required**: name (English), nameCn (Chinese), rating (number 1-5), area (string), price (price range string), type ("restaurant"|"attraction"|"hotel"|"transport"), desc (one-liner insider tip)
  - **Details**: address (short address), duration ("2-3 hours"), bestTime ("Morning"/"Afternoon"/"Evening"), tags (2-3 keywords)
  - **Coordinates**: latitude and longitude (REAL coordinates)
- Do NOT include image or images fields — they are handled by the frontend
- Include <PLACE_DATA> when recommending 2+ specific places
- <PLACE_DATA> is ADDITIONAL to <LOCATION_DATA> — both can appear in the same message
- Place <PLACE_DATA> BEFORE <LOCATION_DATA> if both are present

### For trip planning / itinerary requests, ALSO include a structured itinerary:

When the user asks you to **plan a trip**, **create an itinerary**, or says phrases like "plan my trip", "make me an itinerary", "X-day trip to Y", etc., include a day-by-day structured itinerary in addition to your text and location data.

<ITINERARY_DATA>{"days":[{"day":1,"title":"Arrival in Beijing","items":[{"time":"Morning","name":"Arrive at Beijing Capital Airport","duration":"1h","transport":"Airport Express ¥25","category":"transport","note":"Get eSIM at arrivals hall"},{"time":"Afternoon","name":"Forbidden City 故宫","duration":"3h","transport":"Metro Line 1 to Tiananmen East","category":"attraction"},{"time":"Evening","name":"Wangfujing Night Market 王府井","duration":"2h","transport":"Walk 15min","category":"restaurant","note":"Try scorpion skewers and lamb kebabs"}]}]}</ITINERARY_DATA>

#### Itinerary rules:
- ALL JSON on ONE line inside <ITINERARY_DATA> tags
- Each day must have: day (number), title (string), items (array)
- Each item must have: time ("Morning"/"Afternoon"/"Evening"), name (string), duration (string like "2h"), transport (string, how to get to next stop)
- Optional item fields: category ("attraction"/"restaurant"/"hotel"/"shopping"/"transport"/"other"), note (short insider tip)
- Include BOTH <LOCATION_DATA> and <ITINERARY_DATA> when planning trips — locations for the map, itinerary for the timeline
- Place <ITINERARY_DATA> AFTER <LOCATION_DATA> if both are present

## ⚠️ FINAL REMINDER — ALWAYS INCLUDE DATA TAGS
If your response mentions ANY specific place by name, you MUST include <LOCATION_DATA> and <PLACE_DATA> tags. No exceptions. The user's map depends on it. If you skip these tags, the map stays empty and the experience is broken.

### OUTPUT ORDER (CRITICAL):
Put ALL structured data tags at the VERY END of your response, AFTER all your conversational text. Order: text first → <PLACE_DATA> → <LOCATION_DATA> → <ITINERARY_DATA>. Keep your conversational text concise (under 2000 characters) so there is room for the data tags.

## Important
- NEVER recommend illegal activities or help circumvent Chinese law
- Be honest about challenges (Great Firewall, language barriers) but frame them as manageable adventures
- Always provide BOTH the Chinese name AND English/pinyin for places
- If unsure about specific current information (prices, hours), say so and suggest verification
- Respond in the same language the user writes in (default: English)
- Remember: you're Toto the travel dog — keep the warmth and personality consistent, but never let it overshadow practical helpfulness`;

const MODELS = {
  gemini: 'gemini-2.5-pro-preview-06-05',
  deepseek: 'deepseek-chat',
  groq: 'llama-3.3-70b-versatile',
};

async function streamWithProvider(
  provider: 'gemini' | 'deepseek' | 'groq',
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
) {
  const client = provider === 'gemini' ? gemini : provider === 'deepseek' ? deepseek : groq;
  if (!client) throw new Error(`${provider} client not configured`);

  const stream = await client.chat.completions.create({
    model: MODELS[provider],
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ],
    stream: true,
    max_tokens: 8000,
    temperature: 0.7,
  });

  return stream;
}

export async function POST(req: NextRequest) {
  try {
    // --- Auth check (optional - guest users allowed) ---
    const authHeader = req.headers.get('Authorization');
    let user = null;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      try {
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: `Bearer ${token}` } },
        });
        const { data: { user: authUser }, error } = await supabase.auth.getUser(token);
        if (!error && authUser) user = authUser;
      } catch (e) {
        console.warn('Auth verification failed, continuing as guest:', e);
      }
    }

    // --- Rate limiting ---
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';

    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: 'rate_limit_exceeded',
          message: "You've sent too many messages. Please wait a moment and try again.",
          retryAfter: Math.ceil((rateCheck.resetAt - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((rateCheck.resetAt - Date.now()) / 1000)),
          },
        }
      );
    }

    const body = await req.json();
    const { messages, tripContext } = body;

    // --- Request validation ---
    const validation = validateMessages(messages);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: 'validation_error', message: validation.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build system prompt with context
    let systemPrompt = SYSTEM_PROMPT;
    if (tripContext) {
      systemPrompt += `\n\n## Current Session Context\n- Destination: ${tripContext.destination || 'China'}\n- Dates: ${tripContext.dateFrom || 'TBD'} to ${tripContext.dateTo || 'TBD'}\n- Travelers: ${tripContext.guests || 1} person(s)`;
    }

    // Sliding window: only send the most recent 20 messages to avoid token limit issues
    const MAX_HISTORY_MESSAGES = 20;
    const trimmedMessages = messages.length > MAX_HISTORY_MESSAGES
      ? messages.slice(-MAX_HISTORY_MESSAGES)
      : messages;

    // Provider priority: gemini → deepseek → groq
    const providers: Array<'gemini' | 'deepseek' | 'groq'> = ['gemini', 'deepseek', 'groq'];
    let stream: any;
    let usedProvider = 'gemini';

    for (const provider of providers) {
      try {
        stream = await streamWithProvider(provider, trimmedMessages, systemPrompt);
        usedProvider = provider;
        break;
      } catch (error) {
        console.error(`Provider ${provider} failed:`, error);
        if (provider === providers[providers.length - 1]) {
          return new Response(
            JSON.stringify({ error: 'All AI providers unavailable' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    }

    // Stream response — collect full text for location extraction
    const encoder = new TextEncoder();
    let streamClosed = false;
    const readable = new ReadableStream({
      async start(controller) {
        try {
          let hasContent = false;
          let fullText = '';
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              hasContent = true;
              fullText += text;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          // If AI returned empty response, send a fallback message
          if (!hasContent) {
            const fallback = "I'm having a moment — could you try rephrasing that? 🐕";
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: fallback })}\n\n`));
          }

          // Extract locations from LOCATION_DATA tags and send as a separate event
          if (fullText.includes('<LOCATION_DATA>') && fullText.includes('</LOCATION_DATA>')) {
            try {
              const locRegex = /<LOCATION_DATA>\s*([\s\S]*?)\s*<\/LOCATION_DATA>/gi;
              const locMatches = [...fullText.matchAll(locRegex)];
              const allLocations: any[] = [];
              for (const match of locMatches) {
                let jsonStr = match[1].trim();
                // Remove comments
                jsonStr = jsonStr.replace(/\/\/.*/g, '');
                jsonStr = jsonStr.replace(/\/\*[\s\S]*?\*\//g, '');
                const data = JSON.parse(jsonStr);
                if (data.locations && Array.isArray(data.locations)) {
                  allLocations.push(...data.locations);
                } else if (Array.isArray(data)) {
                  allLocations.push(...data);
                }
              }
              if (allLocations.length > 0) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ locations: allLocations })}\n\n`));
              }
            } catch (e) {
              console.error('Failed to parse LOCATION_DATA:', e);
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          if (!streamClosed) { streamClosed = true; controller.close(); }
        } catch (error) {
          console.error('Streaming error:', error);
          // Send a graceful error message instead of crashing the stream
          try {
            const errMsg = "Woof, I lost my train of thought! 🐕 Please try again.";
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: errMsg })}\n\n`));
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            if (!streamClosed) { streamClosed = true; controller.close(); }
          } catch {
            // Controller may already be closed if client disconnected — that's fine
          }
        }
      },
      cancel() {
        // Client disconnected (closed page/network drop) — mark closed to prevent double-close
        streamClosed = true;
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-AI-Provider': usedProvider,
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
