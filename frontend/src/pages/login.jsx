import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const FloatingParticle = ({ style }) => (
  <div className="absolute w-1 h-1 rounded-full bg-indigo-400/30 animate-float" style={style} />
);

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/login/', { username, password });
      login({ access: response.data.access, refresh: response.data.refresh });
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please check your username and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12 overflow-hidden bg-grid">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

        {/* Floating particles */}
        {[
          { top: '20%', left: '15%', animationDelay: '0s' },
          { top: '70%', left: '80%', animationDelay: '1s' },
          { top: '40%', left: '75%', animationDelay: '2s' },
          { top: '80%', left: '25%', animationDelay: '0.5s' },
        ].map((p, i) => <FloatingParticle key={i} style={p} />)}

        <div className="relative z-10 max-w-sm text-center">
          {/* Logo */}
          <div className="flex items-center gap-2 justify-center mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center glow-indigo">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              CareerMind <span className="gradient-text">AI</span>
            </span>
          </div>

          {/* Animated career flow */}
          <div className="space-y-3 mb-10">
            {[
              { icon: '👤', label: 'Student Profile', active: true },
              { icon: '🧬', label: 'Career DNA', active: true },
              { icon: '⚡', label: 'Skill Analysis', active: true },
              { icon: '🗺️', label: 'Career Paths', active: false },
              { icon: '✅', label: 'Job Ready', active: false },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm border ${
                  step.active ? 'bg-indigo-500/20 border-indigo-500/40' : 'bg-[#111118] border-[#1a1a25]'
                }`}>
                  {step.icon}
                </div>
                <span className={`text-sm font-medium ${step.active ? 'text-white' : 'text-[#55556a]'}`}>
                  {step.label}
                </span>
                {step.active && (
                  <motion.div
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"
                  />
                )}
              </motion.div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Welcome back
          </h2>
          <p className="text-sm text-[#55556a] leading-relaxed">
            Your career journey continues here. Sign in to access your personalized roadmap and AI coach.
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 justify-center mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-base font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              CareerMind <span className="gradient-text">AI</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Sign in</h1>
          <p className="text-sm text-[#55556a] mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Create one
            </Link>
          </p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2"
            >
              <span className="text-red-400 text-lg flex-shrink-0">⚠</span>
              <p className="text-xs text-red-300">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-[#9898b0] mb-2 uppercase tracking-wider">Username</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55556a]" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#9898b0] mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55556a]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-[#9898b0] transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[#2a2a38] bg-[#0d0d12] accent-indigo-500"
                />
                <span className="text-xs text-[#55556a]">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.01, boxShadow: '0 0 25px rgba(99,102,241,0.35)' } : {}}
              whileTap={!isLoading ? { scale: 0.99 } : {}}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#1a1a25]" />
            <span className="text-xs text-[#55556a]">or</span>
            <div className="flex-1 h-px bg-[#1a1a25]" />
          </div>

          {/* Google (visual only) */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 py-3 border border-[#1a1a25] bg-[#0d0d12] hover:bg-[#111118] rounded-xl text-sm text-[#9898b0] hover:text-white transition-all"
          >
            <div className="w-4 h-4 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 via-yellow-400 via-green-400 to-blue-500 opacity-80" style={{backgroundImage: 'conic-gradient(from 0deg, #4285f4 0%, #34a853 25%, #fbbc04 50%, #ea4335 75%, #4285f4 100%)'}} />
            </div>
            Continue with Google
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;