import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

// DeepSeek client (OpenAI-compatible)
const deepseek = process.env.DEEPSEEK_API_KEY ? new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
}) : null;

// Groq client (OpenAI-compatible)
const groq = process.env.GROQ_API_KEY ? new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
}) : null;

// Anthropic Claude client
const anthropic = process.env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
}) : null;

const SYSTEM_PROMPT = `You are a friendly AI travel assistant for travelers visiting China.

When users ask for recommendations, you MUST:
1. Write your response text
2. End with location data in <LOCATION_DATA> tags

EXAMPLE FORMAT:

Your conversational response here...

<LOCATION_DATA>{"locations":[{"id":"xiaonanguo-shanghai","name":"小南国","description":"Famous dumpling restaurant","category":"restaurant","address":"上海市黄浦区建国中路508号","latitude":31.2304,"longitude":121.4737,"rating":4.5,"priceLevel":3,"estimatedCost":150,"currency":"CNY","visitDuration":"1-2 hours","tags":["dumplings","local"]}]}</LOCATION_DATA>

CRITICAL RULES:
- JSON on ONE line
- Each location MUST have UNIQUE id (use place name + city)
- NO trailing commas
- Use real coordinates
- Max 2-3 locations

Be helpful!`;

// Model mapping for different providers
const MODELS = {
  deepseek: 'deepseek-chat',
  groq: 'llama-3.3-70b-versatile', // Fast and good quality
  claude: 'claude-3-5-sonnet-20241022', // High quality
};

async function streamOpenAICompatible(
  provider: 'deepseek' | 'groq',
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
) {
  const client = provider === 'deepseek' ? deepseek : groq;

  if (!client) {
    throw new Error(`${provider} client not configured`);
  }

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
    max_tokens: 2000,
    temperature: 0.7,
  });

  return stream;
}

async function streamClaude(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
) {
  if (!anthropic) {
    throw new Error('Claude client not configured');
  }

  const stream = await anthropic.messages.stream({
    model: MODELS.claude,
    max_tokens: 2000,
    system: systemPrompt,
    messages: messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
  });

  return stream;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, tripContext, aiProvider } = await req.json();

    // Determine which provider to use
    // Priority: user selection > env variable > default (deepseek)
    let primaryProvider: 'deepseek' | 'groq' | 'claude';
    let fallbackProvider: 'deepseek' | 'groq' | 'claude';

    if (aiProvider && aiProvider !== 'auto') {
      // User explicitly selected a provider
      primaryProvider = aiProvider as 'deepseek' | 'groq' | 'claude';
      // Set appropriate fallback
      fallbackProvider = primaryProvider === 'claude' ? 'deepseek' : (primaryProvider === 'deepseek' ? 'groq' : 'deepseek');
    } else {
      // Auto mode or not specified - use env variable or default
      primaryProvider = (process.env.AI_PROVIDER as 'deepseek' | 'groq' | 'claude') || 'deepseek';
      fallbackProvider = primaryProvider === 'deepseek' ? 'groq' : 'deepseek';
    }

    // Add trip context to system prompt if available
    const systemPrompt = tripContext
      ? `${SYSTEM_PROMPT}\n\nCurrent Trip Context:\n- Destination: ${tripContext.destination || 'China'}\n- Dates: ${tripContext.dateFrom || 'TBD'} to ${tripContext.dateTo || 'TBD'}\n- Travelers: ${tripContext.guests || 1} person(s)`
      : SYSTEM_PROMPT;

    let stream: any;
    let usedProvider = primaryProvider;
    let isClaude = primaryProvider === 'claude';

    try {
      // Try primary provider
      if (primaryProvider === 'claude') {
        stream = await streamClaude(messages, systemPrompt);
      } else {
        stream = await streamOpenAICompatible(primaryProvider, messages, systemPrompt);
      }
    } catch (error) {
      console.error(`Primary provider (${primaryProvider}) failed, trying fallback:`, error);

      // Try fallback provider (always OpenAI-compatible: deepseek or groq)
      try {
        stream = await streamOpenAICompatible(fallbackProvider, messages, systemPrompt);
        isClaude = false;
        usedProvider = fallbackProvider;
      } catch (fallbackError) {
        console.error(`Fallback provider (${fallbackProvider}) also failed:`, fallbackError);
        return new Response(
          JSON.stringify({ error: 'All AI providers unavailable' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Create a TransformStream to convert stream to our format
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          if (isClaude) {
            // Claude streaming format
            for await (const event of stream) {
              if (event.type === 'content_block_delta') {
                const text = event.delta.type === 'text_delta' ? event.delta.text : '';
                if (text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                }
              }
            }
          } else {
            // OpenAI-compatible streaming format
            for await (const chunk of stream) {
              const text = chunk.choices[0]?.delta?.content || '';
              if (text) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
              }
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-AI-Provider': usedProvider, // Let frontend know which provider was used
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
