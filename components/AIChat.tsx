import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { getCostumeRecommendation } from '../services/geminiService';
import { ChatMessage, CartItem } from '../types';

interface AIChatProps {
  cart: CartItem[];
}

const AIChat: React.FC<AIChatProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Salam Paskibra! Saya asisten AI siap membantu Anda memilih seragam terbaik untuk pasukan Anda. Ada yang bisa saya bantu?',
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const cartContext = cart.length > 0 
        ? `User memiliki ${cart.length} item di keranjang: ${cart.map(i => i.name).join(', ')}`
        : 'Keranjang user masih kosong.';

      const responseText = await getCostumeRecommendation(userMsg.text, cartContext);

      const botMsg: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden border border-slate-200 pointer-events-auto transition-all duration-300 transform origin-bottom-right animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-red-700 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="font-semibold">Asisten PaskibraRent</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-red-800 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-blue-600' : 'bg-red-600'
                  } text-white`}
                >
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center shrink-0 text-white">
                   <Bot size={14} />
                 </div>
                 <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
                   <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya rekomendasi kostum..."
              className="flex-1 px-4 py-2 bg-slate-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-red-700 text-white rounded-full hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-red-700 text-white p-4 rounded-full shadow-lg hover:bg-red-800 hover:scale-105 transition-all duration-200 flex items-center gap-2 group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className={`max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium ${!isOpen ? 'md:max-w-xs px-2' : ''}`}>
           {isOpen ? 'Tutup Chat' : 'Konsultasi AI'}
        </span>
      </button>
    </div>
  );
};

export default AIChat;
