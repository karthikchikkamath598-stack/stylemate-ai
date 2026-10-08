import React, { useState } from 'react';
import { X, Send, Sparkles, BookOpen, Bot, User, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../services/api';
import type { RetrievedChunk } from '../types';

interface ChatStylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  sources?: RetrievedChunk[];
}

export const ChatStylistModal: React.FC<ChatStylistModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Hello! I'm your StyleMate AI fashion concierge. Ask me anything about outfit pairing, color harmony, or fabric choices—I'll consult our fashion knowledge base using RAG to answer you!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'What should I wear with a beige skirt?',
    'How can I style a black dress for a dinner?',
    'What fabrics work best for hot humid weather?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendChatMessage(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: res.answer,
          sources: res.retrieved_chunks,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Sorry, I encountered an issue retrieving from the knowledge base. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-2xl h-[640px] flex flex-col rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-950/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                Ask Your Stylist
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Powered by RAG Vector Knowledge Retrieval
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
            aria-label="Close Chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Message Scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-4 text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-rose-500 text-white rounded-tr-none'
                    : 'bg-stone-100 dark:bg-stone-800/80 text-stone-800 dark:text-stone-200 border border-stone-200/60 dark:border-stone-700/60 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Retrieved Sources preview if available */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 space-y-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-amber-500" /> RAG Knowledge Cited:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.sources.map((s, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700"
                        >
                          {s.source} ({Math.round(s.relevance_score * 100)}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-full bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-stone-200 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-stone-500 italic">
              <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
              <span>Searching ChromaDB knowledge base...</span>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        <div className="px-6 py-2 bg-stone-50/50 dark:bg-stone-950/30 border-t border-stone-100 dark:border-stone-800/60 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-stone-400 shrink-0">Try:</span>
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="shrink-0 text-xs px-2.5 py-1 rounded-full border border-stone-200 dark:border-stone-700 hover:border-rose-400 hover:text-rose-500 text-stone-600 dark:text-stone-300 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about styling, colors, or fabrics..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:border-rose-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 disabled:opacity-50 hover:bg-rose-600 transition-colors"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
