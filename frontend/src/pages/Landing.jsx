import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ChevronRight, ArrowRight, Zap, Map, Briefcase,
  Mic, GitBranch, Brain, TrendingUp, Target, Play, Star, Check
} from 'lucide-react';

// Animated counter hook
function useCounter(target, duration = 2000, start = false) {
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

// Skill bar in hero preview
const HeroSkillBar = ({ label, value, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="space-y-1"
  >
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-[#9898b0] font-medium">{label}</span>
      <span className="text-[11px] text-indigo-400 font-semibold">{value}/10</span>
    </div>
    <div className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value * 10}%` }}
        transition={{ delay: delay + 0.3, duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
      />
    </div>
  </motion.div>
);

// Feature card
const FeatureCard = ({ icon: Icon, title, description, color, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className="group relative p-6 rounded-2xl border border-[#1a1a25] bg-[#0d0d12] hover:border-[#2a2a3a] transition-all duration-300 hover:-translate-y-1"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4`} style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
      <p className="text-[#55556a] text-xs leading-relaxed">{description}</p>
    </motion.div>
  );
};

// Step in "How It Works"
const Step = ({ number, title, description, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className="relative flex flex-col items-center text-center"
    >
      <div className="w-12 h-12 rounded-full border border-indigo-500/40 bg-indigo-500/10 flex items-center justify-center mb-4 relative">
        <span className="text-indigo-400 font-bold text-sm">{String(number).padStart(2, '0')}</span>
      </div>
      <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
      <p className="text-[#55556a] text-xs leading-relaxed max-w-[160px]">{description}</p>
    </motion.div>
  );
};

// Career path card
const CareerCard = ({ role, match, icon, color, delay }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="group relative p-4 rounded-2xl border border-[#1a1a25] bg-[#0d0d12] hover:border-[#2a2a3a] transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}08, transparent 70%)` }}
      />
      <div className="relative">
        <div className="text-2xl mb-3">{icon}</div>
        <h3 className="text-white font-semibold text-sm mb-1">{role}</h3>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-1 bg-[#1a1a2e] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${match}%`, backgroundColor: color }} />
          </div>
          <span className="text-xs font-bold" style={{ color }}>{match}%</span>
        </div>
        <p className="text-[10px] text-[#55556a] mt-1">career match</p>
      </div>
    </motion.div>
  );
};

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });

  const studentsCount = useCounter(12400, 2000, statsInView);
  const rolesCount = useCounter(50, 1500, statsInView);
  const matchRate = useCounter(94, 2000, statsInView);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: Brain, title: 'Career DNA Analysis', description: 'AI analyzes your resume, GitHub activity, and skills to build your unique career fingerprint.', color: '#6366f1' },
    { icon: Zap, title: 'Skill Gap Intelligence', description: 'Know exactly which skills are missing between where you are and your dream role.', color: '#8b5cf6' },
    { icon: Map, title: 'Personalized Roadmap', description: 'Get a week-by-week learning plan tailored to your goals, not a generic tutorial list.', color: '#3b82f6' },
    { icon: TrendingUp, title: 'Job Readiness Score', description: 'A single number that measures your real career readiness. Watch it grow.', color: '#14b8a6' },
    { icon: Mic, title: 'AI Mock Interview', description: 'Practice interviews generated from your actual profile. Get scored and coached.', color: '#a78bfa' },
    { icon: GitBranch, title: 'GitHub Intelligence', description: 'Turn your coding activity into career evidence that employers can see.', color: '#10b981' },
  ];

  const careerPaths = [
    { role: 'Backend Developer', match: 86, icon: '⚙️', color: '#6366f1' },
    { role: 'AI Engineer', match: 72, icon: '🤖', color: '#8b5cf6' },
    { role: 'Full Stack Dev', match: 68, icon: '🖥️', color: '#3b82f6' },
    { role: 'Data Scientist', match: 61, icon: '📊', color: '#14b8a6' },
    { role: 'DevOps Engineer', match: 44, icon: '🚀', color: '#f59e0b' },
    { role: 'Cybersecurity', match: 38, icon: '🔐', color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white overflow-x-hidden">
      {/* Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong border-b border-[#1a1a25]' : ''}`}>
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-bold text-sm" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              CareerMind <span className="gradient-text">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'Career Paths', 'Pricing'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-xs text-[#9898b0] hover:text-white transition-colors font-medium">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-xs text-[#9898b0] hover:text-white transition-colors font-medium px-3 py-2">
              Sign In
            </Link>
            <motion.button
              onClick={() => navigate('/register')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-xs font-semibold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 transition-all"
            >
              Get Started
            </motion.button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 bg-grid">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-2/3 left-1/4 w-[300px] h-[300px] rounded-full bg-violet-600/8 blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 mb-6"
            >
              <Sparkles size={12} className="text-indigo-400" />
              <span className="text-xs text-indigo-300 font-medium">Powered by Gemini AI</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Your career.
              <br />
              <span className="gradient-text">Mapped by AI.</span>
            </h1>

            <p className="text-[#9898b0] text-base leading-relaxed mb-8 max-w-lg">
              Understand where you stand, discover what you're missing, and build the skills that move you closer to your dream job.
            </p>

            <div className="flex flex-wrap gap-3">
              <motion.button
                onClick={() => navigate('/register')}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl text-sm font-semibold text-white shadow-lg"
              >
                Build My Career Path <ArrowRight size={16} />
              </motion.button>
              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 border border-[#2a2a38] bg-[#0d0d12] rounded-xl text-sm font-semibold text-[#9898b0] hover:text-white hover:border-[#3a3a48] transition-all"
              >
                <Play size={14} className="fill-current" /> Explore Demo
              </motion.button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                {['#6366f1', '#8b5cf6', '#3b82f6', '#14b8a6'].map((color, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-[#050508] flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: color }}>
                    {['R', 'A', 'S', 'M'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={10} className="text-amber-400 fill-current" />)}
                </div>
                <p className="text-[10px] text-[#55556a]">Trusted by 12,000+ students</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Browser frame */}
              <div className="relative rounded-2xl border border-[#2a2a38] bg-[#0d0d12] shadow-2xl overflow-hidden"
                style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 40px 80px rgba(0,0,0,0.6)' }}>
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a1a25] bg-[#111118]">
                  <div className="flex gap-1.5">
                    {['#ef4444', '#f59e0b', '#10b981'].map(c => (
                      <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c, opacity: 0.7 }} />
                    ))}
                  </div>
                  <div className="flex-1 mx-4 bg-[#1a1a25] rounded-lg h-5 flex items-center px-3">
                    <span className="text-[10px] text-[#55556a]">app.careermind.ai/dashboard</span>
                  </div>
                </div>

                {/* Dashboard content */}
                <div className="p-5 space-y-4">
                  {/* Career readiness */}
                  <motion.div
                    className="bg-[#111118] rounded-xl p-4 border border-[#1a1a25]"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[10px] text-[#55556a] font-medium uppercase tracking-wider">Career Readiness</p>
                        <p className="text-3xl font-bold text-white mt-0.5">78 <span className="text-base text-[#55556a]">/ 100</span></p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          <span className="text-[10px] text-emerald-400 font-medium">On Track · +6 this month</span>
                        </div>
                      </div>
                      <div className="w-16 h-16">
                        <svg viewBox="0 0 36 36" className="rotate-[-90deg]">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a1a2e" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="url(#scoreGrad)" strokeWidth="3"
                            strokeDasharray={`${78} ${100 - 78}`} strokeLinecap="round" />
                          <defs>
                            <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#6366f1" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <div className="text-[10px] text-[#9898b0] bg-[#1a1a2e] rounded-lg px-3 py-2">
                      🎯 Target: <span className="text-indigo-400 font-medium">Backend Developer</span>
                    </div>
                  </motion.div>

                  {/* Skills */}
                  <div className="space-y-2.5">
                    <p className="text-[10px] text-[#55556a] font-medium uppercase tracking-wider">Top Skills</p>
                    {[
                      { label: 'Python', value: 8 },
                      { label: 'Django', value: 7 },
                      { label: 'SQL', value: 8 },
                      { label: 'Docker', value: 3 },
                    ].map((skill, i) => (
                      <HeroSkillBar key={skill.label} label={skill.label} value={skill.value} delay={i * 0.1} />
                    ))}
                  </div>

                  {/* AI tip */}
                  <motion.div
                    className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-3 py-2.5 flex items-start gap-2"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles size={12} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] text-indigo-300 leading-relaxed">
                      Focus on <strong>Docker</strong> and <strong>System Design</strong> next — they'll unlock 3 more career paths.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-16 border-y border-[#1a1a25]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: studentsCount.toLocaleString(), label: 'Students guided', suffix: '+' },
              { value: rolesCount, label: 'Career paths mapped', suffix: '+' },
              { value: matchRate, label: 'Job match accuracy', suffix: '%' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}{stat.suffix}</p>
                <p className="text-xs text-[#55556a] mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs text-indigo-400 font-semibold uppercase tracking-widest mb-3"
            >
              Everything you need
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Built for serious career growth
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 border-y border-[#1a1a25] bg-[#080810]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs text-violet-400 font-semibold uppercase tracking-widest mb-3">Simple process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              From zero to job-ready
            </h2>
          </div>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { n: 1, title: 'Tell us about yourself', desc: 'Your current role, goals, skills, and experience in 5 minutes.' },
                { n: 2, title: 'AI analyzes your profile', desc: 'Gemini AI maps your strengths, gaps, and best career paths.' },
                { n: 3, title: 'Build your roadmap', desc: 'Get a personalized week-by-week learning plan.' },
                { n: 4, title: 'Become job ready', desc: 'Track progress, practice interviews, and land your role.' },
              ].map((s, i) => (
                <Step key={i} number={s.n} title={s.title} description={s.desc} delay={i * 0.15} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section id="career-paths" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs text-teal-400 font-semibold uppercase tracking-widest mb-3">AI-matched roles</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Discover your best career paths
            </h2>
            <p className="text-[#9898b0] text-sm mt-3 max-w-md mx-auto">
              Based on a demo profile with Python, Django, SQL and React skills
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {careerPaths.map((c, i) => (
              <CareerCard key={i} {...c} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-violet-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-indigo-600/15 blur-[100px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Stop guessing<br />what to learn.
            </h2>
            <p className="text-[#9898b0] text-base mb-8 max-w-lg mx-auto">
              Let AI build the path between where you are and where you want to be.
            </p>
            <motion.button
              onClick={() => navigate('/register')}
              whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(99,102,241,0.5)' }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-2xl text-base font-semibold text-white shadow-xl"
            >
              Start Your Career Journey <ArrowRight size={18} />
            </motion.button>
            <p className="text-[#55556a] text-xs mt-4">Free to start · No credit card required</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a25] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles size={11} className="text-white" />
            </div>
            <span className="text-xs text-[#55556a]">CareerMind AI · Turn your skills into your career.</span>
          </div>
          <p className="text-xs text-[#55556a]">Built for IBM GenAI Hackathon 2024</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
