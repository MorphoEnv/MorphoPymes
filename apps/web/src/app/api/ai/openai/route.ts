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

**IMPORTANT: Always format your responses using Markdown syntax:**
- Use **bold** for emphasis
- Use ## headers for sections
- Use bullet points (•) and numbered lists
- Use \`code\` for technical terms
- Use > blockquotes for important notes
- Use --- for separators when needed

Your expertise includes:
- Explaining how MorphoPymes works
- Investment advice and analysis
- Entrepreneurship guidance
- Blockchain and DeFi concepts
- Project evaluation and due diligence
- Financial literacy and education
- Tutorials on using the platform

Key platform information:
- MorphoPymes enables micro-investments starting from **$10**
- Built on **Base** (Ethereum Layer 2) for low transaction costs
- Uses **ENS domains** for business identity verification
- Supports SMEs (Small and Medium Enterprises) in Latin America
- Provides transparent, blockchain-based funding

Always be helpful, accurate, and encourage users to make informed investment decisions. If you don't know something specific about the platform, be honest about it. Remember to format your responses with proper Markdown.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Más barato que gpt-3.5-turbo
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

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    // Manejo específico de errores
    let errorMessage = "Lo siento, tengo problemas técnicos. 🔧";
    
    if (error?.status === 429) {
      errorMessage = "Estoy experimentando mucho tráfico en este momento. Por favor intenta de nuevo en unos segundos. 🚦\n\n*Mientras tanto, puedo ayudarte con información básica sobre MorphoPymes.*";
    } else if (error?.status === 401) {
      errorMessage = "Hay un problema con mi configuración. El equipo está trabajando en resolverlo. �\n\n*Puedo seguir ayudándote con información sobre la plataforma mientras tanto.*";
    } else if (error?.code === 'insufficient_quota') {
      errorMessage = "He alcanzado mi límite de uso por ahora. 💳\n\n*¡Pero puedo seguir ayudándote! Pregúntame sobre MorphoPymes, DeFi o inversiones.*";
    }
    
    // Respuestas inteligentes de backup basadas en el contexto
    const { messages: requestMessages } = await request.json();
    const lastUserMessage = requestMessages[requestMessages.length - 1]?.content?.toLowerCase() || "";
    let contextualResponse = "";
    
    if (lastUserMessage.includes("cómo funciona") || lastUserMessage.includes("como funciona")) {
      contextualResponse = "🚀 **¿Cómo funciona MorphoPymes?**\n\n• **Para Inversores**: Invierte desde $10 en PYMEs verificadas\n• **Para Emprendedores**: Accede a capital sin garantías tradicionales\n• **Tecnología**: Base Network + ENS domains para transparencia\n• **Retornos**: 8-25% APY esperados con riesgo diversificado";
    } else if (lastUserMessage.includes("invertir") || lastUserMessage.includes("inversión")) {
      contextualResponse = "💰 **Tutorial de Inversión:**\n\n1️⃣ **Explora**: Revisa proyectos en /invest\n2️⃣ **Analiza**: Lee business plans y métricas\n3️⃣ **Diversifica**: Invierte en múltiples proyectos\n4️⃣ **Monitorea**: Sigue el progreso en /finance\n\n*Recuerda: Solo invierte lo que puedas permitirte perder.*";
    } else if (lastUserMessage.includes("defi") || lastUserMessage.includes("blockchain")) {
      contextualResponse = "⛓️ **DeFi en MorphoPymes:**\n\n• **Base Network**: Layer 2 de Ethereum (costos <$0.05)\n• **Smart Contracts**: Automatización sin intermediarios\n• **ENS Domains**: Identidad verificada para negocios\n• **Transparencia**: Todas las transacciones públicas";
    } else {
      contextualResponse = "🤖 **Soy Morph, tu asistente de MorphoPymes**\n\nPuedo ayudarte con:\n• Explicar cómo funciona la plataforma\n• Guías de inversión paso a paso\n• Información sobre DeFi y blockchain\n• Análisis de proyectos disponibles\n\n¿Qué te gustaría saber?";
    }
    
    return NextResponse.json({ 
      message: `${errorMessage}\n\n---\n\n${contextualResponse}`,
      demo: true,
      error_type: error?.code || 'unknown'
    });
  }
}
