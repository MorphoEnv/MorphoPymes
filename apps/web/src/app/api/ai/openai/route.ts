import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are Morph, the friendly AI assistant for MorphoPymes, a decentralized micro-investment platform that connects Latin American entrepreneurs with global investors through blockchain technology.

Your personality:
- Friendly, helpful, and knowledgeable about DeFi, investments, and entrepreneurship
- You speak both English and Spanish fluently
- You're enthusiastic about helping small businesses and democratizing finance
- You use emojis occasionally to be more engaging 😊

Your expertise includes:
- Explaining how MorphoPymes works
- Investment advice and analysis
- Entrepreneurship guidance
- Blockchain and DeFi concepts
- Project evaluation and due diligence
- Financial literacy and education
- Tutorials on using the platform

Key platform information:
- MorphoPymes enables micro-investments starting from $10
- Built on Base (Ethereum Layer 2) for low transaction costs
- Uses ENS domains for business identity verification
- Supports SMEs (Small and Medium Enterprises) in Latin America
- Provides transparent, blockchain-based funding

Always be helpful, accurate, and encourage users to make informed investment decisions. If you don't know something specific about the platform, be honest about it.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: reply });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
