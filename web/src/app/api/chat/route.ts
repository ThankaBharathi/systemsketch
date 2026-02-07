// app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { parseUserMessage, getGreetingResponse, getGuidanceResponse } from '@/lib/ai/response-parser';
import { ARCHITECTURE_SYSTEM_PROMPT } from '@/lib/ai/prompts';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, designId, existingNodes } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Parse the user's intent
    const parsed = parseUserMessage(message);

    // Handle greetings
    if (parsed.intent === 'greeting') {
      return NextResponse.json({
        message: getGreetingResponse(),
        intent: 'greeting',
        shouldGenerate: false,
      });
    }

    // Handle system design requests
    if (parsed.isSystemDesign && (parsed.intent === 'design' || parsed.intent === 'add')) {
      // Return that we should generate architecture
      return NextResponse.json({
        message: `🏗️ Generating architecture for: ${parsed.systemName || message}...`,
        intent: parsed.intent,
        shouldGenerate: true,
        systemName: parsed.systemName,
        componentType: parsed.componentType,
      });
    }

    // Handle analysis requests
    if (parsed.intent === 'analyze') {
      return NextResponse.json({
        message: '🔍 Analyzing your architecture...',
        intent: 'analyze',
        shouldGenerate: true,
      });
    }

    // Handle questions about system design
    if (parsed.intent === 'question' && parsed.isSystemDesign) {
      return NextResponse.json({
        message: '💡 Let me help you understand that...',
        intent: 'question',
        shouldGenerate: true,
      });
    }

    // Default: provide guidance
    return NextResponse.json({
      message: getGuidanceResponse(),
      intent: 'unknown',
      shouldGenerate: false,
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}