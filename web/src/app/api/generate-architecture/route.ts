// app/api/generate-architecture/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// ============================================
// GROQ ONLY VERSION (FAST + STABLE)
// ============================================
async function callGroq(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `${userPrompt}\n\nRespond with ONLY valid JSON.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Groq API error:', error);
    throw new Error(`Groq API error: ${response.status}`);
  }

  const data = await response.json();

  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('No response from Groq');
  }

  return text;
}

// ============================================
// MAIN API ROUTE
// ============================================
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { systemPrompt, userPrompt, isModification } = await req.json();

    if (!userPrompt) {
      return NextResponse.json({ error: 'Missing user prompt' }, { status: 400 });
    }

    console.log('Using Groq API...');

    const content = await callGroq(systemPrompt, userPrompt);

    return NextResponse.json({
      content,
      isModification,
    });
  } catch (error) {
    console.error('Generate architecture error:', error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to generate architecture',
      },
      { status: 500 }
    );
  }
}
