import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, ChevronRight } from 'lucide-react';
import api from '../../api';

const suggestions = [
  "What should I learn today?",
  "What is my biggest skill gap?",
  "Am I ready for backend jobs?",
  "Suggest a project for this week",
];

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hi! I'm your CareerMind AI. Ask me anything about your career journey. 🚀" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const sendMessage = async (text) => {
    const msgText = text || input.trim();
    if (!msgText || loading) return;
    setInput('');

    const userMsg = { id: Date.now(), sender: 'user', text: msgText };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await api.post('/chat/send/', { message: msgText });
      if (response.data.status === 'success') {
        const aiMsg = { id: Date.now() + 1, sender: 'ai', text: response.data.data.response };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: "I'm having trouble right now. Please try again." }]);
      }
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: "Connection issue. Check if your backend is running." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg flex items-center justify-center z-40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ boxShadow: '0 0 30px rgba(99,102,241,0.4), 0 8px 25px rgba(0,0,0,0.3)' }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles size={22} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-2xl border border-indigo-400/40 animate-ping opacity-30" />
        )}
      </motion.button>

      {/* Chat drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-44 right-6 md:bottom-28 md:right-8 w-80 md:w-96 rounded-2xl overflow-hidden z-40 shadow-2xl"
            style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(0,0,0,0.5)' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles size={15} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">CareerMind AI</p>
                <p className="text-indigo-200 text-xs">Your personal career advisor</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-emerald-300 text-xs">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto bg-[#0d0d12] p-4 space-y-3 no-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px] mr-2 flex-shrink-0 mt-0.5">
                      ✨
                    </div>
                  )}
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-none'
                      : 'bg-[#16161f] border border-[#2a2a38] text-[#d0d0e8] rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px] flex-shrink-0">✨</div>
                  <div className="bg-[#16161f] border border-[#2a2a38] px-3 py-2 rounded-xl rounded-tl-none flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick suggestions */}
            <div className="bg-[#0d0d12] border-t border-[#1a1a25] px-3 py-2 flex gap-2 overflow-x-auto no-scrollbar">
              {suggestions.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="flex-shrink-0 text-[10px] text-[#9898b0] bg-[#16161f] border border-[#2a2a38] px-2.5 py-1.5 rounded-lg hover:border-indigo-500/30 hover:text-white transition-all whitespace-nowrap"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="bg-[#111118] border-t border-[#1a1a25] p-3">
              <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about your career..."
                  className="flex-1 bg-[#16161f] border border-[#2a2a38] rounded-xl px-3 py-2 text-xs text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/50 transition-colors"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-8 h-8 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:scale-105 flex-shrink-0"
                >
                  <Send size={13} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
