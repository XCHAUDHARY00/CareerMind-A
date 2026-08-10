import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    // Scroll to bottom whenever messages list changes
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Load chat history from backend
    const fetchChatHistory = async () => {
        try {
            setInitialLoading(true);
            setError(null);
            const response = await api.get('/chat/history/');
            if (response.data.status === 'success') {
                setMessages(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching chat history:", err);
            setError("Failed to load chat history. Please try again.");
        } finally {
            setInitialLoading(false);
            // Timeout to wait for DOM rendering before scrolling
            setTimeout(scrollToBottom, 100);
        }
    };

    useEffect(() => {
        fetchChatHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Send message to backend
    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsgText = input.trim();
        setInput('');

        // Optimistically add user's message to the chat UI
        const tempUserMsg = {
            id: Date.now(), // temporary id
            sender: 'user',
            message: userMsgText,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, tempUserMsg]);
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/chat/send/', { message: userMsgText });
            if (response.data.status === 'success') {
                const aiReply = {
                    id: Date.now() + 1,
                    sender: 'ai',
                    message: response.data.data.response,
                    timestamp: new Date().toISOString()
                };
                setMessages(prev => [...prev, aiReply]);
            } else {
                setError(response.data.message || "Something went wrong.");
            }
        } catch (err) {
            console.error("Error sending message:", err);
            setError("Failed to get response from AI Coach. Check connection or Gemini key.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0a192f] to-slate-900 font-sans text-slate-300 flex flex-col">
            
            {/* Header */}
            <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="text-teal-400 hover:text-teal-300 transition-colors font-medium flex items-center group"
                    >
                        <span className="mr-1 group-hover:-translate-x-1 transition-transform">←</span> Dashboard
                    </button>
                    <div className="h-6 w-px bg-slate-800"></div>
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-500 flex items-center justify-center text-lg font-bold text-white shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                                🤖
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                        </div>
                        <div>
                            <h1 className="text-md font-bold text-white leading-tight">CreateMind AI Coach</h1>
                            <p className="text-xs text-emerald-400 font-medium">Online • Career Advisor</p>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => {
                        if(window.confirm("Do you want to clear this chat's view? (Backend database records will remain intact for history context)")) {
                            setMessages([]);
                        }
                    }}
                    className="text-xs text-slate-500 hover:text-red-400 border border-slate-800 hover:border-red-500/30 px-3 py-1.5 rounded-lg transition-all"
                >
                    Clear Screen
                </button>
            </header>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 max-w-4xl w-full mx-auto flex flex-col">
                {initialLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 rounded-full border-2 border-t-teal-500 border-r-teal-500 animate-spin"></div>
                        <p className="text-sm text-slate-500 animate-pulse">Loading previous career advice...</p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto my-auto space-y-6">
                        <div className="text-7xl animate-bounce">💬</div>
                        <h2 className="text-2xl font-bold text-white">Ask your Career Coach!</h2>
                        <p className="text-sm text-slate-400">
                            Hi! I am your AI Career Coach. Based on the skills and career goals you've set up in your profile, ask me anything!
                        </p>
                        <div className="grid grid-cols-1 gap-2 w-full pt-4">
                            <button 
                                onClick={() => setInput("What steps should I take next to achieve my career goal?")} 
                                className="text-left text-xs bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-teal-500/30 p-3 rounded-xl transition"
                            >
                                🚀 What steps should I take next to achieve my goal?
                            </button>
                            <button 
                                onClick={() => setInput("Can you suggest some projects to build with my current skills?")} 
                                className="text-left text-xs bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-teal-500/30 p-3 rounded-xl transition"
                            >
                                💻 Can you suggest projects to build with my skills?
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 flex-1">
                        {messages.map((msg, index) => {
                            const isUser = msg.sender === 'user';
                            return (
                                <div 
                                    key={msg.id || index} 
                                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                                >
                                    <div className={`flex items-start space-x-3 max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                                        
                                        {/* Avatar */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                            isUser ? 'bg-indigo-600 text-white' : 'bg-slate-850 border border-slate-700 text-teal-400'
                                        }`}>
                                            {isUser ? 'U' : '🤖'}
                                        </div>

                                        {/* Message Bubble */}
                                        <div className={`p-4 rounded-2xl shadow-md ${
                                            isUser 
                                                ? 'bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-tr-none' 
                                                : 'bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 text-slate-100 rounded-tl-none'
                                        }`}>
                                            {/* Render message with new lines preserved */}
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                            
                                            {/* Message Timestamp */}
                                            <span className="block text-[10px] text-slate-400/80 mt-2 text-right">
                                                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Typing / Loading state */}
                        {loading && (
                            <div className="flex justify-start animate-pulse">
                                <div className="flex items-start space-x-3 max-w-[75%]">
                                    <div className="w-8 h-8 rounded-full bg-slate-850 border border-slate-700 flex items-center justify-center text-sm text-teal-400 flex-shrink-0">
                                        🤖
                                    </div>
                                    <div className="bg-slate-800/60 border border-slate-700/50 p-4 rounded-2xl rounded-tl-none flex items-center space-x-2">
                                        <span className="text-sm text-slate-400">Coach is thinking</span>
                                        <div className="flex space-x-1">
                                            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-950/20 border border-red-500/30 rounded-xl text-red-400 text-sm max-w-md mx-auto text-center">
                                ⚠️ {error}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Form Footer */}
            <footer className="border-t border-slate-800/80 bg-slate-950/40 backdrop-blur-md px-4 py-4 md:px-8">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex items-center space-x-3 bg-slate-800/80 border border-slate-700/60 p-2.5 rounded-full shadow-inner focus-within:border-teal-500/50 transition">
                    <input 
                        type="text" 
                        placeholder={loading ? "Coach is typing..." : "Type your career question here..."} 
                        className="flex-1 bg-transparent px-4 py-2 text-sm text-white focus:outline-none placeholder-slate-500 disabled:opacity-50"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        disabled={loading}
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || loading}
                        className="h-10 px-6 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 text-white font-bold rounded-full text-xs uppercase tracking-wider shadow-md hover:shadow-lg disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                        Send
                    </button>
                </form>
                <p className="text-[10px] text-slate-600 text-center mt-2">
                    CreateMind Coach utilizes Gemini AI & your profile contexts to formulate guidance.
                </p>
            </footer>
        </div>
    );
}

export default Chat;
