import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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

export async function POST(req: NextRequest) {
  try {
    const { messages, tripContext } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Add trip context to system prompt if available
    const systemPrompt = tripContext
      ? `${SYSTEM_PROMPT}\n\nCurrent Trip Context:\n- Destination: ${tripContext.destination || 'China'}\n- Dates: ${tripContext.dateFrom || 'TBD'} to ${tripContext.dateTo || 'TBD'}\n- Travelers: ${tripContext.guests || 1} person(s)`
      : SYSTEM_PROMPT;

    // Create streaming response
    const stream = await anthropic.messages.stream({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1500,
      system: systemPrompt,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      })),
    });

    // Create a TransformStream to convert Anthropic's stream to a readable stream
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta') {
              const text = event.delta.type === 'text_delta' ? event.delta.text : '';
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
