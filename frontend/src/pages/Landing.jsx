import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Sparkles, ChevronRight, ArrowRight, Zap, Map, Briefcase,
  Mic, GitBranch, Brain, TrendingUp, Target, Star, Check, FileText,
  FolderGit2, BookOpen, Sun, Moon, Shield, Award, Play, Terminal, Swords
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Animated Counter Hook
function useCounter(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

const Landing = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('dna');
  const [demoChat, setDemoChat] = useState('');
  const [chatLog, setChatLog] = useState([
    { sender: 'ai', message: "Hi! I'm your SkillForge AI Coach. Ask me how to accelerate your software engineering career!" }
  ]);

  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  const stat1 = useCounter(94, 1500, statsInView);
  const stat2 = useCounter(38, 1500, statsInView);
  const stat3 = useCounter(12, 1500, statsInView);

  const handleDemoSend = (e) => {
    e.preventDefault();
    if (!demoChat.trim()) return;
    const msg = demoChat.trim();
    setChatLog(prev => [...prev, { sender: 'user', message: msg }]);
    setDemoChat('');
    setTimeout(() => {
      setChatLog(prev => [
        ...prev,
        {
          sender: 'ai',
          message: `To level up in ${msg.toLowerCase().includes('backend') ? 'Backend Engineering' : 'Software Development'}, focus on System Design, Docker, and Redis caching. You can run a full AI Skill Gap analysis once you sign up!`
        }
      ]);
    }, 600);
  };

  const featureTabs = [
    { id: 'dna', label: 'Career DNA', icon: Brain, color: '#6366f1' },
    { id: 'gaps', label: 'Skill Gap Analysis', icon: Zap, color: '#8b5cf6' },
    { id: 'github', label: 'GitHub Intelligence', icon: GitBranch, color: '#f59e0b' },
    { id: 'resume', label: 'Resume ATS Engine', icon: FileText, color: '#ec4899' },
    { id: 'interview', label: 'Mock Interview AI', icon: Mic, color: '#f97316' },
    { id: 'projects', label: 'AI Projects', icon: FolderGit2, color: '#10b981' },
    { id: 'roadmap', label: 'Learning Roadmap', icon: Map, color: '#3b82f6' },
    { id: 'battle', label: '1v1 Battle Arena', icon: Swords, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: 'transparent', color: 'var(--text-primary)' }}>

      {/* Grid background overlay */}
      <div className="fixed inset-0 bg-grid opacity-40 pointer-events-none z-0" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b backdrop-blur-xl transition-colors"
        style={{ background: 'var(--header-bg)', borderColor: 'var(--bg-card-border)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-600 to-teal-400 flex items-center justify-center glow-indigo shadow-lg">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-base tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              SkillForge <span className="gradient-text">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
            <a href="#showcase" className="hover:text-indigo-400 transition-colors">Live Interactive Demo</a>
            <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</a>
            <a href="#stats" className="hover:text-indigo-400 transition-colors">Impact</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              id="theme-toggle-landing"
              className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all hover:scale-105"
              style={{ borderColor: 'var(--bg-card-border)', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <Link to="/login" className="text-xs font-semibold px-3 py-2 rounded-xl transition-colors hover:bg-white/5"
              style={{ color: 'var(--text-secondary)' }}>
              Sign In
            </Link>
            <Link to="/register" className="text-xs font-semibold px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl text-white shadow-md hover:from-indigo-600 hover:to-violet-700 transition-all hover:scale-105">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-6 bg-indigo-500/10 border-indigo-500/20">
            <Sparkles size={13} className="text-indigo-400 animate-pulse" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Next-Gen AI Career Operating System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Forge Your Engineering Career with <span className="gradient-text">Autonomous AI</span>
          </h1>

          <p className="text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            SkillForge AI analyzes your code evidence, maps your skill gaps, scores your resume for ATS, and conducts real-time AI mock interviews — all in one unified platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/register')} id="hero-get-started-btn"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-500 via-violet-600 to-teal-500 rounded-2xl text-sm font-bold text-white shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
              Launch Your AI Career DNA <ArrowRight size={16} />
            </button>
            <a href="#showcase" className="w-full sm:w-auto px-6 py-3.5 border rounded-2xl text-sm font-semibold transition-all hover:bg-white/5 flex items-center justify-center gap-2"
              style={{ borderColor: 'var(--bg-card-border)', color: 'var(--text-primary)' }}>
              <Play size={14} className="text-indigo-400" /> Explore Features Demo
            </a>
          </div>
        </motion.div>
      </section>

      {/* INTERACTIVE FEATURE SHOWCASE */}
      <section id="showcase" className="py-16 px-6 max-w-7xl mx-auto z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Interactive Feature Explorer
          </h2>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>Click any feature tab below to preview live AI capabilities without signing up</p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {featureTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                  isActive ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400 shadow-md scale-105' : ''
                }`}
                style={!isActive ? { borderColor: 'var(--bg-card-border)', color: 'var(--text-secondary)', background: 'var(--bg-card)' } : {}}
              >
                <Icon size={14} style={{ color: isActive ? '#6366f1' : tab.color }} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Feature Display Window */}
        <div className="rounded-3xl p-6 sm:p-8 border min-h-[380px] relative overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card-border)', boxShadow: 'var(--shadow-card)' }}>
          <AnimatePresence mode="wait">

            {/* 1. CAREER DNA */}
            {activeTab === 'dna' && (
              <motion.div key="dna" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">AI Skill Mapping</span>
                  <h3 className="text-xl font-bold mt-1 mb-3">Career DNA Engine</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                    SkillForge AI constructs your multidimensional skill matrix by analyzing your target roles, known languages, and domain experience.
                  </p>
                  <div className="space-y-2 mb-4">
                    {['Backend Systems: 85% match', 'Distributed Systems & Databases: High', 'DevOps & Containers: Target Gap'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <Check size={14} className="text-emerald-400" />
                        <span style={{ color: 'var(--text-primary)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate('/register')} className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-xs font-semibold">
                    Generate My Career DNA
                  </button>
                </div>
                <div className="bg-[#09090d] border border-indigo-500/20 rounded-2xl p-5 text-white">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-indigo-400">TARGET ROLE: BACKEND DEVELOPER</span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">86% MATCH</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { skill: 'Python / Django', val: 85 },
                      { skill: 'SQL & PostgreSQL', val: 80 },
                      { skill: 'Docker & Microservices', val: 35 },
                      { skill: 'System Design', val: 40 },
                    ].map(s => (
                      <div key={s.skill}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-gray-300">{s.skill}</span>
                          <span className="font-semibold text-indigo-400">{s.val}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: `${s.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. SKILL GAPS */}
            {activeTab === 'gaps' && (
              <motion.div key="gaps" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs text-violet-400 font-semibold uppercase tracking-wider">Gap Identification</span>
                  <h3 className="text-xl font-bold mt-1 mb-3">AI Skill Gap Diagnostics</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Instantly pinpoint missing skills between your current knowledge and market job postings. Prioritize high-impact learning.
                  </p>
                  <div className="space-y-2 mb-4">
                    {['Docker: Priority HIGH (Required in 87% jobs)', 'Redis: Priority HIGH (In-memory caching)', 'AWS EC2: Priority MEDIUM'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <Zap size={14} className="text-amber-400" />
                        <span style={{ color: 'var(--text-primary)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => navigate('/register')} className="px-4 py-2 bg-violet-600 text-white rounded-xl text-xs font-semibold">
                    Run Skill Gap Analysis
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Docker Containers', current: 3, req: 8, priority: 'High' },
                    { name: 'Redis Pub/Sub', current: 1, req: 6, priority: 'High' },
                    { name: 'AWS Cloud Infra', current: 2, req: 7, priority: 'Medium' },
                  ].map(gap => (
                    <div key={gap.name} className="p-4 rounded-xl border flex items-center justify-between"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--bg-card-border)' }}>
                      <div>
                        <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{gap.name}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>Level: {gap.current} / {gap.req}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${gap.priority === 'High' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'}`}>
                        {gap.priority} Priority
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 3. GITHUB INTELLIGENCE */}
            {activeTab === 'github' && (
              <motion.div key="github" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Proof of Work</span>
                  <h3 className="text-xl font-bold mt-1 mb-3">GitHub Evidence Intelligence</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Connect GitHub to turn public code repositories, commit streaks, and stars into validated career evidence that recruiters trust.
                  </p>
                  <button onClick={() => navigate('/register')} className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-semibold">
                    Connect GitHub
                  </button>
                </div>
                <div className="p-5 rounded-2xl border bg-[#09090d] text-white space-y-3">
                  <div className="flex items-center gap-3">
                    <GitBranch className="text-amber-400" size={24} />
                    <div>
                      <p className="text-xs font-bold">@octocat</p>
                      <p className="text-[10px] text-gray-400">32 Public Repositories · 142 Stars</p>
                    </div>
                    <span className="ml-auto text-xs bg-amber-500/20 text-amber-400 font-bold px-2.5 py-1 rounded-lg">
                      84/100 Quality
                    </span>
                  </div>
                  <div className="p-3 bg-gray-900 rounded-xl border border-gray-800 text-[11px] space-y-1">
                    <p className="text-emerald-400 font-semibold">✓ Active Commit Streak: 7 Days 🔥</p>
                    <p className="text-gray-300">Top Language: Python (54%), JavaScript (32%)</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. RESUME ATS ENGINE */}
            {activeTab === 'resume' && (
              <motion.div key="resume" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs text-pink-400 font-semibold uppercase tracking-wider">ATS Optimization</span>
                  <h3 className="text-xl font-bold mt-1 mb-3">Resume PDF Intelligence</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Upload your PDF resume to extract raw text, compute ATS readiness scores, and get actionable AI bullet-point improvements.
                  </p>
                  <button onClick={() => navigate('/register')} className="px-4 py-2 bg-pink-500 text-white rounded-xl text-xs font-semibold">
                    Score My Resume
                  </button>
                </div>
                <div className="p-5 rounded-2xl border bg-[#09090d] text-white flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-bold">ATS Score: <span className="text-pink-400">78%</span></p>
                    <p className="text-[11px] text-gray-400">✓ Technical Skills Section Present</p>
                    <p className="text-[11px] text-gray-400">✓ Quantified Impact Metrics Found</p>
                    <p className="text-[11px] text-amber-400">⚠ Missing Docker & Cloud Keywords</p>
                  </div>
                  <div className="w-20 h-20 rounded-full border-4 border-pink-500/40 flex items-center justify-center text-xl font-bold text-pink-400">
                    78
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. MOCK INTERVIEW AI */}
            {activeTab === 'interview' && (
              <motion.div key="interview" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs text-orange-400 font-semibold uppercase tracking-wider">Real-Time Simulator</span>
                  <h3 className="text-xl font-bold mt-1 mb-3">Interactive AI Mock Interview</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Practice technical & behavioral questions in a live voice/text chat environment. Receive instant scoring on technical depth and communication clarity.
                  </p>
                  <button onClick={() => navigate('/register')} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-semibold">
                    Start Mock Interview
                  </button>
                </div>
                <div className="p-4 rounded-2xl border bg-[#09090d] text-white space-y-3 font-mono text-[11px]">
                  <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800 text-orange-300">
                    AI Interiewer: "How would you design a rate limiter middleware for a high-traffic REST API?"
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-950 border border-indigo-900 text-indigo-200">
                    Candidate: "I would use Redis with a Token Bucket algorithm to track requests per client IP."
                  </div>
                  <p className="text-emerald-400 font-sans text-xs">✓ Feedback: Excellent technical choice! Score: 92/100</p>
                </div>
              </motion.div>
            )}

            {/* 6. PROJECTS */}
            {activeTab === 'projects' && (
              <motion.div key="projects" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Zero API Cost</span>
                  <h3 className="text-xl font-bold mt-1 mb-3">Skill-Targeted AI Projects</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Build production-ready projects derived dynamically from your personal skill gaps. Every project includes milestones and tech stack guides.
                  </p>
                  <button onClick={() => navigate('/register')} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold">
                    Explore Projects
                  </button>
                </div>
                <div className="p-5 rounded-2xl border bg-[#09090d] text-white space-y-2">
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">HIGH IMPACT</span>
                  <h4 className="text-sm font-bold">Containerized Microservices API</h4>
                  <p className="text-xs text-gray-400">Build Django + React + PostgreSQL inside Docker Compose containers.</p>
                  <div className="flex gap-2 text-[10px] text-indigo-300 pt-2">
                    <span className="bg-gray-800 px-2 py-0.5 rounded">Docker</span>
                    <span className="bg-gray-800 px-2 py-0.5 rounded">Django</span>
                    <span className="bg-gray-800 px-2 py-0.5 rounded">PostgreSQL</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 7. ROADMAP */}
            {activeTab === 'roadmap' && (
              <motion.div key="roadmap" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Structured Path</span>
                  <h3 className="text-xl font-bold mt-1 mb-3">Personalized Learning Roadmap</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Get a weekly step-by-step milestone plan tailored to your target job role. Track tasks from course study to building real software.
                  </p>
                  <button onClick={() => navigate('/register')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
                    Build My Roadmap
                  </button>
                </div>
                <div className="p-5 rounded-2xl border bg-[#09090d] text-white space-y-3">
                  <div className="border-l-2 border-blue-500 pl-3">
                    <p className="text-xs font-bold text-blue-400">WEEK 1: Docker Fundamentals</p>
                    <p className="text-[11px] text-gray-300">Complete Docker Crash Course & Containerize API</p>
                  </div>
                  <div className="border-l-2 border-gray-700 pl-3">
                    <p className="text-xs font-bold text-gray-400">WEEK 2: Redis Caching & Queues</p>
                    <p className="text-[11px] text-gray-500">Implement Redis pub/sub for real-time messaging</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 8. 1V1 BATTLE ARENA */}
            {activeTab === 'battle' && (
              <motion.div key="battle" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <span className="text-xs text-red-400 font-semibold uppercase tracking-wider">Multiplayer Gamification</span>
                  <h3 className="text-xl font-bold mt-1 mb-3">Real-Time 1v1 Battles</h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Challenge your friends to live coding races or fast-paced CS quizzes. Watch their progress in real-time, win matches, and climb the global leaderboard.
                  </p>
                  <button onClick={() => navigate('/register')} className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold">
                    Create Match Room
                  </button>
                </div>
                <div className="p-4 rounded-2xl border bg-[#09090d] text-white space-y-4">
                  <div className="flex justify-between items-center px-2">
                     <div className="flex items-center gap-2">
                       <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=6366f1" className="w-8 h-8 rounded-full" />
                       <span className="text-xs font-bold">You (Lvl 42)</span>
                     </div>
                     <span className="text-xl font-black italic text-red-500 font-mono">VS</span>
                     <div className="flex items-center gap-2">
                       <span className="text-xs font-bold">Rival (Lvl 45)</span>
                       <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ef4444" className="w-8 h-8 rounded-full" />
                     </div>
                  </div>
                  <div className="bg-gray-900 rounded-xl p-3 border border-gray-800 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-1 bg-red-500 w-full animate-pulse" />
                    <p className="text-[10px] text-gray-400 font-mono uppercase">Room Code: X7B9K2</p>
                    <p className="text-sm font-bold text-indigo-400 mt-1">Python: Two Sum Problem</p>
                    <div className="flex justify-between text-[10px] mt-2 font-mono text-gray-500">
                      <span>02:14</span>
                      <span className="text-emerald-400">Rival Submitting...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ALL FEATURES GRID */}
      <section id="features" className="py-16 px-6 max-w-7xl mx-auto z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Complete Feature Suite</span>
          <h2 className="text-2xl sm:text-4xl font-bold mt-1 mb-3" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Everything You Need to Get Hired Faster
          </h2>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-muted)' }}>
            Designed specifically for developers, engineers, and computer science students.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Brain, title: 'Career DNA Analysis', desc: 'AI-driven multidimensional evaluation of your engineering strengths and target job roles.', color: '#6366f1' },
            { icon: Zap, title: 'Skill Gap Diagnostics', desc: 'Compare known skills against real job market requirements to prioritize what to learn next.', color: '#8b5cf6' },
            { icon: GitBranch, title: 'GitHub Intelligence', desc: 'Turn commit streaks, public repos, and star metrics into validated proof of work.', color: '#f59e0b' },
            { icon: FileText, title: 'Resume ATS Engine', desc: 'PDF text extraction and Gemini ATS scoring with actionable bullet-point tips.', color: '#ec4899' },
            { icon: Swords, title: '1v1 Battle Arena', desc: 'Compete in live, real-time multiplayer coding & quiz matches to earn XP.', color: '#ef4444' },
            { icon: Mic, title: 'Mock Interview AI', desc: 'Interactive mock interview simulator with instant scoring on clarity and technical accuracy.', color: '#f97316' },
            { icon: FolderGit2, title: 'Derived AI Projects', desc: 'Custom project specifications derived from your skill gaps with zero extra API costs.', color: '#10b981' },
            { icon: Map, title: 'Dynamic Roadmap', desc: 'Weekly milestone timeline connecting courses, builds, and proof tasks in one flow.', color: '#3b82f6' },
            { icon: Shield, title: 'Light / Dark Mode', desc: 'Complete Token-based design system with seamless 1-click theme switching.', color: '#14b8a6' },
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card-border)', boxShadow: 'var(--shadow-card)' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                  <Icon size={18} style={{ color: f.color }} />
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* LIVE AI COACH PREVIEW */}
      <section className="py-16 px-6 max-w-4xl mx-auto z-10">
        <div className="rounded-3xl p-6 sm:p-8 border relative overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card-border)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white">
              <Terminal size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold">Try SkillForge AI Assistant Live</h3>
              <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Test a career question right now</p>
            </div>
          </div>

          <div className="h-44 overflow-y-auto space-y-3 p-3 rounded-xl mb-4 border text-xs"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--bg-card-border)' }}>
            {chatLog.map((c, i) => (
              <div key={i} className={`flex ${c.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2.5 rounded-xl ${
                  c.sender === 'user' ? 'bg-indigo-500 text-white' : 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300'
                }`}>
                  {c.message}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleDemoSend} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask e.g. How do I transition to Senior Backend Developer?"
              value={demoChat}
              onChange={e => setDemoChat(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:border-indigo-500/60"
              style={{ background: 'var(--bg-input)', borderColor: 'var(--bg-card-border)', color: 'var(--text-primary)' }}
            />
            <button type="submit" className="px-5 py-2.5 bg-indigo-500 text-white font-semibold rounded-xl text-xs hover:bg-indigo-600 transition-all">
              Send
            </button>
          </form>
        </div>
      </section>

      {/* PROOF STATS */}
      <section ref={statsRef} className="py-12 border-y z-10" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--bg-card-border)' }}>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-extrabold gradient-text">{stat1}%</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Resume ATS Pass Rate</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold gradient-text-blue">{stat2}%</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Faster Skill Gap Closure</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-teal-400">{stat3}k+</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>AI Mock Interviews Conducted</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 px-6 text-center z-10 relative">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Ready to Build Your Engineering Legacy?
          </h2>
          <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Join thousands of software engineers using SkillForge AI to analyze skills, optimize resumes, and master technical interviews.
          </p>
          <button onClick={() => navigate('/register')} id="cta-get-started-btn"
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-violet-600 to-teal-400 text-white rounded-2xl text-sm font-bold shadow-2xl hover:scale-105 transition-all">
            Get Started Free — No Credit Card Required
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t text-center text-xs" style={{ borderColor: 'var(--bg-card-border)', color: 'var(--text-muted)' }}>
        <p>© 2026 SkillForge AI. Next-Gen AI Career Operating System for Developers.</p>
      </footer>
    </div>
  );
};

export default Landing;
