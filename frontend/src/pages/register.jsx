import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, User, Mail, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import api from '../api';

const PasswordStrengthBar = ({ password }) => {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const strength = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i < strength ? colors[strength] : '#1a1a25' }}
          />
        ))}
      </div>
      <p className="text-[10px] font-medium" style={{ color: colors[strength] || '#55556a' }}>
        {labels[strength]}
      </p>
    </div>
  );
};

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreedTerms) {
      setError('Please accept the terms and conditions.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await api.post('/register/', {
        username: form.username,
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
      });
      navigate('/login');
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const firstError = Object.values(data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { id: 'first_name', label: 'First Name', type: 'text', placeholder: 'Enter your first name', half: true },
    { id: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Enter your last name', half: true },
    { id: 'username', label: 'Username', type: 'text', placeholder: 'Enter a username', icon: <User size={14} /> },
    { id: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email', icon: <Mail size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center px-6 py-12 bg-grid">
      {/* Background glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-indigo-600/8 blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              CareerMind <span className="gradient-text">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-sm text-[#55556a]">
            Already have one?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-6 shadow-2xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30"
            >
              <p className="text-xs text-red-300">⚠ {error}</p>
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* First + Last name */}
            <div className="grid grid-cols-2 gap-3">
              {['first_name', 'last_name'].map(field => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-[#9898b0] mb-1.5 uppercase tracking-wider">
                    {field === 'first_name' ? 'First Name' : 'Last Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={form[field]}
                    onChange={e => update(field, e.target.value)}
                    placeholder={field === 'first_name' ? 'Raj' : 'Chaudhary'}
                    className="w-full bg-[#111118] border border-[#1a1a25] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all"
                  />
                </div>
              ))}
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-[#9898b0] mb-1.5 uppercase tracking-wider">Username</label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55556a]" />
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={e => update('username', e.target.value)}
                  placeholder="rajchaudhary"
                  className="w-full bg-[#111118] border border-[#1a1a25] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#9898b0] mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55556a]" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="raj@example.com"
                  className="w-full bg-[#111118] border border-[#1a1a25] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#9898b0] mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55556a]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full bg-[#111118] border border-[#1a1a25] rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-[#9898b0] transition-colors">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <PasswordStrengthBar password={form.password} />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#9898b0] mb-1.5 uppercase tracking-wider">Confirm Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55556a]" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-[#111118] border rounded-xl pl-9 pr-10 py-2.5 text-sm text-white placeholder-[#55556a] focus:outline-none transition-all ${
                    form.confirmPassword && form.password !== form.confirmPassword
                      ? 'border-red-500/50 focus:border-red-500/70'
                      : form.confirmPassword && form.password === form.confirmPassword
                      ? 'border-emerald-500/50 focus:border-emerald-500/70'
                      : 'border-[#1a1a25] focus:border-indigo-500/60'
                  }`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#55556a] hover:text-[#9898b0] transition-colors">
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                {form.confirmPassword && form.password === form.confirmPassword && (
                  <div className="absolute right-8 top-1/2 -translate-y-1/2">
                    <Check size={14} className="text-emerald-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={e => setAgreedTerms(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 rounded border-[#2a2a38] bg-[#111118] accent-indigo-500"
              />
              <span className="text-xs text-[#55556a] leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-indigo-400 hover:text-indigo-300">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-indigo-400 hover:text-indigo-300">Privacy Policy</a>
              </span>
            </label>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.01, boxShadow: '0 0 25px rgba(99,102,241,0.35)' } : {}}
              whileTap={!isLoading ? { scale: 0.99 } : {}}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
              ) : (
                <>Create My CareerMind <ArrowRight size={15} /></>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
