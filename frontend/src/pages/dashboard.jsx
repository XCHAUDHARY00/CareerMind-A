import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  TrendingUp, Zap, FolderGit2, Mic, ArrowRight,
  Sparkles, Target, Clock, CheckCircle, ChevronRight,
  AlertTriangle, BookOpen
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import api from '../api';
import {
  mockDashboardStats, mockSkillGaps, mockCareerPaths,
  mockRoadmap, mockUser, mockAchievements
} from '../data/mockData';

// Animated counter
function AnimatedNumber({ value, suffix = '', duration = 1500 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let startTime;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.round(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// Score ring
const ScoreRing = ({ score, size = 100, strokeWidth = 6, color = '#6366f1' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const dash = (score / 100) * circumference;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1a1a2e" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size/2} cy={size/2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: circumference - dash }}
        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
      />
    </svg>
  );
};

// Stat card
const StatCard = ({ icon: Icon, label, value, suffix, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5 hover:border-[#2a2a38] transition-all duration-300 group"
  >
    <div className="flex items-center justify-between mb-3">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon size={17} style={{ color }} />
      </div>
      <ChevronRight size={14} className="text-[#2a2a38] group-hover:text-[#55556a] transition-colors" />
    </div>
    <p className="text-2xl font-bold text-white">
      <AnimatedNumber value={parseInt(value)} suffix={suffix} />
    </p>
    <p className="text-xs text-[#55556a] mt-1">{label}</p>
  </motion.div>
);

// Priority badge
const PriorityBadge = ({ priority }) => {
  const config = {
    high: { label: 'High', bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/25' },
    medium: { label: 'Medium', bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/25' },
    low: { label: 'Low', bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/25' },
  };
  const c = config[priority] || config.low;
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/myprofile/').then(res => {
      if (res.data?.data) setProfileData(res.data.data);
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  const displayName = profileData?.user?.username || mockUser.firstName;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const topGaps = mockSkillGaps.filter(s => s.priority === 'high').slice(0, 3);
  const topPaths = mockCareerPaths.slice(0, 3);
  const week1Tasks = mockRoadmap.weeks[0].tasks;
  const earnedAchievements = mockAchievements.filter(a => a.earned);

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {greeting}, {displayName} 👋
            </h1>
            <p className="text-sm text-[#55556a] mt-0.5">Here's your career progress today.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#0d0d12] border border-[#1a1a25] rounded-xl">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span className="text-xs text-[#9898b0]">All systems online</span>
          </div>
        </motion.div>

        {/* Hero: Career Readiness */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-6 overflow-hidden"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Score */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <ScoreRing score={78} size={110} strokeWidth={7} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">78</span>
                  <span className="text-[10px] text-[#55556a]">/ 100</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-[#55556a] uppercase tracking-wider font-medium mb-1">Career Readiness</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-sm font-semibold text-emerald-400">On Track</span>
                </div>
                <p className="text-xs text-[#55556a] mt-1">+6 points this month</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-[#9898b0]">
                  <Target size={12} />
                  <span>Target: <span className="text-indigo-400 font-medium">Backend Developer</span></span>
                </div>
              </div>
            </div>

            {/* AI Next Move */}
            <div className="md:col-span-2 bg-indigo-500/8 border border-indigo-500/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={15} className="text-indigo-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">Your Next Best Move</p>
                  <p className="text-sm text-white font-medium mb-2">
                    Learn Docker and containerize your Django project.
                  </p>
                  <p className="text-xs text-[#9898b0] mb-3">
                    This single skill will unlock <strong className="text-white">3 more career paths</strong> and boost your readiness score by an estimated <strong className="text-white">+8 points</strong>.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#55556a]">
                      <Clock size={10} />
                      <span>~8 hours</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#55556a]">
                      <TrendingUp size={10} />
                      <span>High career impact</span>
                    </div>
                    <button
                      onClick={() => navigate('/courses')}
                      className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-[11px] text-white font-semibold transition-colors"
                    >
                      Start Learning <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={TrendingUp} label="Career Match" value={86} suffix="%" color="#6366f1" delay={0.15} />
          <StatCard icon={Zap} label="Skill Progress" value={64} suffix="%" color="#8b5cf6" delay={0.2} />
          <StatCard icon={FolderGit2} label="Projects Built" value={3} suffix="" color="#14b8a6" delay={0.25} />
          <StatCard icon={Mic} label="Interview Score" value={74} suffix="%" color="#f59e0b" delay={0.3} />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Skill Gaps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-white">Top Skill Gaps</h2>
              <button onClick={() => navigate('/skill-gaps')} className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="space-y-4">
              {topGaps.map((gap, i) => (
                <motion.div
                  key={gap.id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">{gap.name}</span>
                    </div>
                    <PriorityBadge priority={gap.priority} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${gap.current * 10}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                      />
                    </div>
                    <span className="text-[10px] text-[#55556a] whitespace-nowrap">{gap.current}/{gap.required}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <button
              onClick={() => navigate('/skill-gaps')}
              className="w-full mt-5 py-2 text-xs text-[#55556a] border border-[#1a1a25] rounded-xl hover:border-indigo-500/30 hover:text-indigo-400 transition-all"
            >
              View Full Skill Gap Analysis
            </button>
          </motion.div>

          {/* Roadmap preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-white">This Week's Tasks</h2>
              <button onClick={() => navigate('/roadmap')} className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Full roadmap <ChevronRight size={12} />
              </button>
            </div>
            <div className="relative pl-5 space-y-4">
              {/* Vertical line */}
              <div className="absolute left-2 top-2 bottom-2 w-px bg-[#1a1a25]" />
              {week1Tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="relative"
                >
                  <div className={`absolute -left-3 top-1 w-2 h-2 rounded-full border ${
                    task.status === 'in-progress' ? 'bg-indigo-500 border-indigo-400' :
                    task.status === 'done' ? 'bg-emerald-500 border-emerald-400' :
                    'bg-[#1a1a2e] border-[#2a2a3a]'
                  }`} />
                  <div className={`pl-3 py-1 ${task.status === 'in-progress' ? 'opacity-100' : 'opacity-70'}`}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                        task.type === 'course' ? 'bg-blue-500/20 text-blue-400' :
                        task.type === 'build' ? 'bg-teal-500/20 text-teal-400' :
                        'bg-violet-500/20 text-violet-400'
                      }`}>{task.type}</span>
                      {task.status === 'in-progress' && (
                        <span className="text-[9px] text-indigo-400 font-medium">In Progress</span>
                      )}
                    </div>
                    <p className="text-xs text-white font-medium">{task.title}</p>
                    <p className="text-[10px] text-[#55556a] mt-0.5 flex items-center gap-1">
                      <Clock size={9} />{task.duration}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button
              onClick={() => navigate('/roadmap')}
              className="w-full mt-5 py-2 text-xs text-[#55556a] border border-[#1a1a25] rounded-xl hover:border-indigo-500/30 hover:text-indigo-400 transition-all"
            >
              Open Full Roadmap
            </button>
          </motion.div>

          {/* Career matches + Achievements */}
          <div className="space-y-4">
            {/* Career matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-white">Top Career Matches</h2>
                <button onClick={() => navigate('/career-dna')} className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                  Explore <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-2">
                {topPaths.map((path, i) => (
                  <motion.div
                    key={path.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-transparent hover:border-[#1a1a25] hover:bg-[#111118] transition-all cursor-pointer"
                    onClick={() => navigate('/career-dna')}
                  >
                    <span className="text-lg">{path.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{path.role}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${path.match}%`, backgroundColor: path.color }} />
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: path.color }}>{path.match}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-white">Achievements</h2>
                  <p className="text-[10px] text-[#55556a] mt-0.5">Career XP: <span className="text-indigo-400 font-semibold">2,840</span></p>
                </div>
                <div className="px-2 py-1 bg-orange-500/15 border border-orange-500/25 rounded-lg flex items-center gap-1.5">
                  <span className="text-sm">🔥</span>
                  <span className="text-[10px] font-bold text-orange-400">7 day streak</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {earnedAchievements.map((a) => (
                  <div key={a.id} className="flex flex-col items-center gap-1 p-2 bg-[#111118] border border-[#1a1a25] rounded-xl">
                    <span className="text-xl">{a.icon}</span>
                    <p className="text-[9px] text-[#9898b0] text-center leading-tight">{a.title}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* AI Insight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-indigo-500/8 to-violet-500/8 border border-indigo-500/15 rounded-2xl p-5 flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
              <Sparkles size={18} className="text-indigo-400" />
            </motion.div>
          </div>
          <div>
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">AI Insight</p>
            <p className="text-sm text-white">
              Based on your current profile, <strong>Backend Development</strong> is your strongest career path with an 86% match. Your biggest opportunity is in cloud infrastructure — learning Docker and AWS could make you job-ready within 90 days.
            </p>
          </div>
        </motion.div>

        {/* Quick links to other pages */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Career DNA', icon: '🧬', path: '/career-dna', color: '#6366f1' },
            { label: 'Courses', icon: '📚', path: '/courses', color: '#8b5cf6' },
            { label: 'Jobs', icon: '💼', path: '/jobs', color: '#3b82f6' },
            { label: 'Projects', icon: '🛠️', path: '/projects', color: '#14b8a6' },
            { label: 'GitHub', icon: '🐙', path: '/github', color: '#10b981' },
            { label: 'Resume', icon: '📄', path: '/resume', color: '#f59e0b' },
          ].map((item, i) => (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-3 bg-[#0d0d12] border border-[#1a1a25] hover:border-[#2a2a38] rounded-2xl flex flex-col items-center gap-2 transition-all"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[11px] font-medium text-[#9898b0]">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <AIAssistant />
    </AppLayout>
  );
};

export default Dashboard;
