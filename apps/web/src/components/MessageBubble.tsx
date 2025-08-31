'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'morph';
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${
        isUser 
          ? 'bg-blue-600 text-white rounded-2xl rounded-br-md' 
          : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
      } p-4 shadow-sm`}>
        {isUser ? (
          // Para mensajes del usuario, texto normal
          <p className="text-sm whitespace-pre-line">{message.content}</p>
        ) : (
          // Para mensajes de Morph, renderizar Markdown
          <div className="text-sm prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Personalizar estilos de elementos Markdown
                h1: ({children}) => <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>,
                h2: ({children}) => <h2 className="text-base font-bold mb-2 text-gray-900">{children}</h2>,
                h3: ({children}) => <h3 className="text-sm font-bold mb-1 text-gray-900">{children}</h3>,
                p: ({children}) => <p className="mb-2 last:mb-0 text-gray-900">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                li: ({children}) => <li className="text-gray-900">{children}</li>,
                strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
                em: ({children}) => <em className="italic text-gray-900">{children}</em>,
                code: ({children}) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono text-gray-900">{children}</code>,
                pre: ({children}) => <pre className="bg-gray-200 p-3 rounded-lg overflow-x-auto text-xs font-mono mb-2">{children}</pre>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic mb-2 text-gray-700">{children}</blockquote>,
                a: ({href, children}) => <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                hr: () => <hr className="my-3 border-gray-300" />,
                table: ({children}) => <table className="w-full border-collapse border border-gray-300 mb-2 text-xs">{children}</table>,
                th: ({children}) => <th className="border border-gray-300 px-2 py-1 bg-gray-100 font-semibold">{children}</th>,
                td: ({children}) => <td className="border border-gray-300 px-2 py-1">{children}</td>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
        <p className={`text-xs mt-2 ${
          isUser ? 'text-blue-100' : 'text-gray-500'
        }`}>
          {message.timestamp.toLocaleTimeString('es', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
}
