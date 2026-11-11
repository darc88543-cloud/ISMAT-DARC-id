import React, { useState } from 'react';
import { X, Send, Bot, ShieldCheck } from 'lucide-react';
import { AplexLogo } from './AplexLogo';

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenInstallModal: () => void;
}

interface ChatMessage {
  id: number;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const SupportChatModal: React.FC<SupportChatModalProps> = ({
  isOpen,
  onClose,
  onOpenInstallModal,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! Welcome to APLEX 24/7 VIP Support. How can we assist you today?',
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      time: 'Just now',
    };
    setMessages((prev) => [...prev, userMsg]);
    const query = inputText.toLowerCase();
    setInputText('');

    // Automated smart agent response
    setTimeout(() => {
      let reply = 'Thank you for your message. An APLEX support specialist is reviewing your request.';
      if (query.includes('download') || query.includes('app') || query.includes('install') || query.includes('home')) {
        reply = 'You can install APLEX directly to your mobile home screen! Tap "Install App" in the header or in your profile drawer for instant 1-tap access.';
      } else if (query.includes('deposit') || query.includes('momo') || query.includes('airtel') || query.includes('money')) {
        reply = 'We support instant MTN Mobile Money and Airtel Money deposits in Uganda! Minimum deposit is 500 USh with 0% processing fees.';
      } else if (query.includes('withdraw') || query.includes('cash out')) {
        reply = 'Withdrawals are processed instantly to your registered MTN or Airtel wallet via our automated payout system.';
      } else if (query.includes('admin') || query.includes('darc')) {
        reply = 'Super Admin portal can be accessed by signing in with authorized administrative credentials.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: reply,
          time: 'Just now',
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[3700] flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div
        className="relative w-full max-w-[420px] h-[520px] bg-[#0c2419] border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl text-white flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#06180f] px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AplexLogo size="sm" showText={false} />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-white">APLEX Support</span>
                <span className="w-2 h-2 rounded-full bg-[#00e676] animate-pulse" />
              </div>
              <p className="text-[10px] text-[#8aa396] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#00e676]" /> 24/7 Live Concierge
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick FAQ Chips */}
        <div className="p-2.5 bg-[#081e13] border-b border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              onClose();
              onOpenInstallModal();
            }}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-emerald-500/20 text-[#00e676] border border-emerald-500/30 whitespace-nowrap"
          >
            📲 Install App to Home Screen
          </button>
          <button
            onClick={() => {
              setInputText('How do I deposit with MTN MoMo?');
            }}
            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white/5 text-[#d1e0d7] border border-white/10 whitespace-nowrap hover:bg-white/10"
          >
            💳 MTN / Airtel Deposit
          </button>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-3 no-scrollbar">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#00e676] text-[#041209] font-semibold rounded-tr-none'
                    : 'bg-[#06180f] text-[#edf2f7] border border-white/10 rounded-tl-none shadow-sm'
                }`}
              >
                {m.sender === 'bot' && (
                  <div className="flex items-center gap-1 text-[10px] text-[#00e676] font-bold mb-1">
                    <Bot className="w-3 h-3" /> APLEX Concierge
                  </div>
                )}
                {m.text}
              </div>
              <span className="text-[9px] text-[#8aa396] mt-1 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Input Field */}
        <form onSubmit={handleSend} className="p-3 bg-[#06180f] border-t border-white/10 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[#0c2419] border border-white/15 rounded-xl px-3 text-xs text-white focus:border-[#00e676] outline-none"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-xl bg-[#00e676] text-[#041209] flex items-center justify-center hover:bg-[#00c853] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
