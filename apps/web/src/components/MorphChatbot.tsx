'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import MessageBubble from './MessageBubble';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'morph';
  timestamp: Date;
}

interface MorphChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function MorphChatbot({ isOpen, onToggle }: MorphChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy Morph, tu asistente de MorphoPymes 😊\n\n¿En qué puedo ayudarte hoy? Puedo:\n• Explicarte cómo funciona la plataforma\n• Ayudarte a analizar inversiones\n• Darte tutoriales paso a paso\n• Responder preguntas sobre proyectos',
      sender: 'morph',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Preparar mensajes para la API de OpenAI
      const apiMessages = messages
        .filter(msg => msg.sender === 'user' || msg.sender === 'morph')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content,
        }));

      // Agregar el mensaje actual del usuario
      apiMessages.push({
        role: 'user',
        content: inputMessage,
      });

      // Llamar a nuestra API de OpenAI
      const response = await fetch('/api/ai/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.message) {
        throw new Error('No message in response');
      }

      const morphResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: 'morph',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, morphResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, estoy teniendo problemas técnicos en este momento. 🔧\n\n¿Podrías intentar de nuevo? Si el problema persiste, verifica que la API Key de OpenAI esté configurada correctamente.',
        sender: 'morph',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { label: '¿Cómo funciona?', message: '¿Cómo funciona MorphoPymes?' },
    { label: 'Tutorial de inversión', message: 'Dame un tutorial de cómo invertir paso a paso' },
    { label: 'Analizar proyecto', message: 'Ayúdame a analizar un proyecto de inversión' },
    { label: 'Sobre DeFi', message: '¿Qué es DeFi y cómo se aplica aquí?' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                {!imageError ? (
                  <Image
                    src="/Morphy.png"
                    alt="Morph"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={() => setImageError(true)}
                    priority
                  />
                ) : (
                  <Image
                    src="/mariposa.png"
                    alt="Morph"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">Morph</h3>
                <p className="text-blue-100 text-sm">Tu asistente de MorphoPymes</p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md p-4 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="px-4 pb-4">
            <p className="text-sm text-gray-600 mb-3">Preguntas rápidas:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(action.message)}
                  className="text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-700 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta..."
              className="flex-1 resize-none border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm max-h-20 min-h-[44px]"
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
