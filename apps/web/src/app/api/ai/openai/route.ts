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

    const systemPrompt = `You are Morph, the official AI assistant for MorphoPymes, a revolutionary decentralized micro-investment platform connecting Latin American entrepreneurs with global investors through blockchain technology.

CRITICAL: Your primary and ONLY focus is helping users with MorphoPymes-related topics. Always redirect conversations back to the platform, investments, and DeFi.

Your personality:
- Expert in MorphoPymes platform functionality
- Passionate about democratizing finance for SMEs
- Enthusiastic about blockchain and DeFi applications
- Bilingual (Spanish/English) with focus on Latin American market
- Use emojis strategically 😊

**ALWAYS format responses using Markdown syntax for better readability.**

Your SPECIALIZED knowledge areas (ONLY discuss these):
1. **MorphoPymes Platform**: How to use /invest, /finance, /dashboard, /account pages
2. **Investment Strategy**: Portfolio diversification, risk management, ROI analysis
3. **Blockchain Technology**: Base Network, Ethereum, ENS domains, smart contracts
4. **SME Funding**: Business plan evaluation, market analysis, growth projections  
5. **DeFi Education**: Decentralized finance concepts applied to micro-investments
6. **Platform Features**: User registration, KYC, wallet connection, transaction flow

Key platform information to always reference:
- **Minimum investment**: $10 USD
- **Technology stack**: Base (Ethereum L2) + ENS domains + Smart contracts
- **Target market**: Latin American SMEs + Global investors
- **Expected returns**: 8-25% APY (risk-adjusted)
- **Transaction costs**: <$0.05 thanks to Base Network
- **Investment process**: Browse → Analyze → Invest → Monitor
- **Available pages**: /invest (browse projects), /finance (portfolio), /dashboard (overview), /account (profile)

CONVERSATION GUARDRAILS:
- If asked about non-MorphoPymes topics, politely redirect: "That's interesting, but let me help you with MorphoPymes instead! [relevant topic]"
- Always connect general investment questions to MorphoPymes features
- For blockchain questions, focus on how MorphoPymes uses the technology
- For business questions, relate to SME funding through the platform

RESPONSE STRUCTURE:
1. Address the user's question within MorphoPymes context
2. Provide actionable advice related to the platform
3. Guide towards relevant platform features/pages
4. End with a follow-up question to keep engagement focused

Remember: You are THE MorphoPymes expert. Every response should add value to the user's MorphoPymes journey.`;

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
      contextualResponse = "🚀 **¿Cómo funciona MorphoPymes?**\n\n## Para Inversores:\n• **Explora** proyectos en [`/invest`](/invest)\n• **Analiza** business plans y métricas\n• **Invierte** desde **$10 USD**\n• **Monitorea** tu portfolio en [`/finance`](/finance)\n\n## Para Emprendedores:\n• **Regístrate** con ENS domain\n• **Sube** tu business plan\n• **Recibe** funding transparente\n• **Reporta** progreso a inversores\n\n### Tecnología:\n- ⚡ **Base Network**: Transacciones <$0.05\n- 🔗 **Smart Contracts**: Automatización total\n- 🛡️ **ENS Domains**: Identidad verificada\n\n¿Quieres que te guíe por alguna sección específica?";
    } else if (lastUserMessage.includes("invertir") || lastUserMessage.includes("inversión")) {
      contextualResponse = "💰 **Tutorial: Tu Primera Inversión en MorphoPymes**\n\n## Paso a Paso:\n\n### 1️⃣ **Explora Proyectos**\n- Ve a [`/invest`](/invest)\n- Filtra por categoría e intereses\n- Lee descripciones y business plans\n\n### 2️⃣ **Analiza Oportunidades**\n- 📊 **ROI esperado**: 8-25% APY\n- 👥 **Equipo**: Experiencia del fundador\n- 📈 **Tracción**: Usuarios/ventas actuales\n- 🎯 **Mercado**: Tamaño y competencia\n\n### 3️⃣ **Diversifica tu Portfolio**\n- **Mínimo**: $10 por proyecto\n- **Recomendado**: 5-10 proyectos diferentes\n- **Sectores**: TechHealth, FinTech, Food & Beverage\n\n### 4️⃣ **Monitorea en [`/finance`](/finance)**\n- Dashboard completo de tus inversiones\n- Updates en tiempo real\n- Métricas de performance\n\n> **Tip**: Comienza con $50-100 distribuidos en 5 proyectos diferentes.\n\n¿Te gustaría que analicemos algún proyecto específico?";
    } else if (lastUserMessage.includes("defi") || lastUserMessage.includes("blockchain")) {
      contextualResponse = "⛓️ **DeFi en MorphoPymes: Democratizando las Finanzas**\n\n## ¿Por qué Blockchain?\n\n### 🌍 **Acceso Global**\n- **Sin fronteras**: Invierte desde cualquier país\n- **Sin bancos**: Tu wallet es tu cuenta\n- **24/7**: Mercado siempre abierto\n\n### 💡 **Tecnología que Usamos**\n- **Base Network** (Ethereum L2)\n  - Costos: <$0.05 por transacción\n  - Velocidad: 2 segundos por bloque\n  - Seguridad: Respaldada por Ethereum\n\n- **Smart Contracts**\n  - Automatizan todo el proceso\n  - Eliminan intermediarios\n  - Transparencia total\n\n- **ENS Domains**\n  - Identidad verificada: `empresa.morphopymes.eth`\n  - Simplifica pagos y comunicación\n  - Brand recognition para SMEs\n\n### 📊 **Ventajas vs Finanzas Tradicionales**\n| Tradicional | MorphoPymes (DeFi) |\n|-------------|--------------------|\n| Mín. $1000+ | Mín. **$10** |\n| Fees 2-5% | Fees **<0.1%** |\n| Solo locales | **Global** |\n| Opaco | **Transparente** |\n\n¿Quieres que te explique algún aspecto técnico específico?";
    } else if (lastUserMessage.includes("proyecto") || lastUserMessage.includes("analizar")) {
      contextualResponse = "📊 **Cómo Analizar Proyectos en MorphoPymes**\n\n## Framework de Análisis:\n\n### 🎯 **1. Modelo de Negocio**\n- **Escalabilidad**: ¿Puede crecer sin límites?\n- **Revenue streams**: ¿Múltiples fuentes de ingreso?\n- **Mercado objetivo**: ¿Suficientemente grande?\n\n### 👥 **2. Equipo Fundador**\n- **Experiencia previa**: Track record\n- **Complementariedad**: Skills diversos\n- **Compromiso**: Full-time en el proyecto\n- **ENS domain**: ¿Verificado en la plataforma?\n\n### 💰 **3. Financieros**\n- **Use of funds**: ¿Destino claro del dinero?\n- **Burn rate**: ¿Cuánto gastan mensualmente?\n- **Revenue projections**: ¿Realistas?\n- **Break-even**: ¿Cuándo serán rentables?\n\n### 📈 **4. Tracción Actual**\n- **Users/Customers**: ¿Ya tienen clientes?\n- **Revenue**: ¿Ya generan ingresos?\n- **Growth rate**: ¿Crecimiento mensual?\n- **Partnerships**: ¿Aliados estratégicos?\n\n### 🏆 **Red Flags a Evitar:**\n- ❌ Sin business plan detallado\n- ❌ Proyecciones poco realistas\n- ❌ Equipo incompleto\n- ❌ Sin tracción demostrable\n\n**¿Tienes algún proyecto específico de [`/invest`](/invest) que quieras que analicemos juntos?**";
    } else if (lastUserMessage.includes("portfolio") || lastUserMessage.includes("finanzas")) {
      contextualResponse = "📈 **Gestión de Portfolio en MorphoPymes**\n\n## Tu Dashboard en [`/finance`](/finance):\n\n### 📊 **Métricas Clave**\n- **Portfolio Value**: Valor actual total\n- **Total Returns**: Ganancias/pérdidas\n- **ROI Average**: Retorno promedio\n- **Active Investments**: Proyectos activos\n\n### 🎯 **Estrategias de Diversificación**\n\n#### **Por Sector**\n- 🏥 **HealthTech**: 20-30%\n- 💰 **FinTech**: 25-35% \n- 🍔 **Food & Beverage**: 15-25%\n- 🛍️ **E-commerce**: 15-25%\n- 🔧 **Other**: 5-10%\n\n#### **Por Etapa**\n- 🌱 **Early Stage**: 40-50% (mayor riesgo/retorno)\n- 🌿 **Growth Stage**: 30-40% (riesgo moderado)\n- 🌳 **Mature**: 10-20% (menor riesgo)\n\n#### **Por Geografía**\n- 🇲🇽 **México**: 25-35%\n- 🇨🇴 **Colombia**: 20-30%\n- 🇦🇷 **Argentina**: 15-25%\n- 🇨🇱 **Chile**: 10-20%\n- 🌎 **Otros**: 5-15%\n\n### 📱 **Monitoreo Regular**\n- **Weekly**: Revisa updates de proyectos\n- **Monthly**: Rebalanceo si necesario\n- **Quarterly**: Análisis profundo de performance\n\n¿Quieres que revisemos tu estrategia actual?";
    } else {
      contextualResponse = "🤖 **¡Hola! Soy Morph, tu experto en MorphoPymes** 🚀\n\n### Especialidades que manejo:\n\n🏦 **Platform Features**\n- Navegación en [`/invest`](/invest), [`/finance`](/finance), [`/dashboard`](/dashboard)\n- Proceso completo de inversión\n- Análisis de proyectos disponibles\n\n💰 **Investment Strategy**\n- Portfolio diversification\n- Risk assessment\n- ROI optimization\n- Due diligence framework\n\n⛓️ **Blockchain & DeFi**\n- Base Network advantages\n- Smart contract automation\n- ENS domain verification\n- Transaction cost analysis\n\n📊 **Business Analysis**\n- SME evaluation criteria\n- Market opportunity sizing\n- Financial projections review\n- Team assessment\n\n### 🎯 **Preguntas Frecuentes:**\n- \"¿Cómo funciona MorphoPymes?\"\n- \"¿Cómo empiezo a invertir?\"\n- \"¿Qué es DeFi y cómo me beneficia?\"\n- \"¿Cómo analizo proyectos?\"\n- \"¿Cómo gestiono mi portfolio?\"\n\n**¿Qué te gustaría explorar primero?** 😊";
    }
    
    return NextResponse.json({ 
      message: `${errorMessage}\n\n---\n\n${contextualResponse}`,
      demo: true,
      error_type: error?.code || 'unknown'
    });
  }
}
