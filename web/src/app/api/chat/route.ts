import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, designId, context } = await req.json();

    // For now, return simple responses
    // Later, integrate with Tambo or OpenAI
    const response = generateResponse(message, context);

    return NextResponse.json({
      message: response,
      designId,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

function generateResponse(message: string, context: { designName?: string }): string {
  const lower = message.toLowerCase();

  if (lower.includes('hello') || lower.includes('hi')) {
    return `👋 Hello! I'm helping you design "${context.designName || 'your system'}".\n\nWhat would you like to build?`;
  }

  if (lower.includes('twitter')) {
    return `🐦 **Twitter Architecture**

I'll help you design Twitter. Here are the main components:

**Services:**
• API Gateway
• User Service  
• Tweet Service
• Timeline Service
• Notification Service

**Data Stores:**
• PostgreSQL (users, tweets)
• Redis (cache, sessions)
• Elasticsearch (search)

**Infrastructure:**
• Load Balancer
• Message Queue (Kafka)

Would you like me to explain any of these?`;
  }

  if (lower.includes('url') || lower.includes('shortener')) {
    return `🔗 **URL Shortener Architecture**

Simple but powerful design:

**Services:**
• URL Service - Generates short codes
• Redirect Service - Handles redirects
• Analytics Service - Tracks clicks

**Data Stores:**
• PostgreSQL/MySQL - Store mappings
• Redis - Cache popular URLs

**Flow:**
1. User submits long URL
2. Generate unique short code
3. Store mapping in DB
4. Return short URL

What aspect would you like to explore?`;
  }

  return `I'll help you with: "${message}"

What specific components do you need? Try:
• "Add a database"
• "Add caching"
• "Show me the architecture"`;
}