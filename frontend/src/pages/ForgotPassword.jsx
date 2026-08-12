import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mail, Lock, ShieldAlert, CheckCircle2, ArrowLeft, KeyRound, Eye, EyeOff } from 'lucide-react';
import api from '../api';

const ForgotPassword = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password, 3: Success
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/password/reset/', { email: emailOrUsername });
      setSuccessMsg(response.data.message || 'Verification code sent to registered email.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not verify user. Please check email/username.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/password/reset/confirm/', {
        email: emailOrUsername,
        otp: otp,
        new_password: newPassword
      });
      setSuccessMsg(response.data.message || 'Password reset successfully!');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] relative flex items-center justify-center p-6 overflow-hidden bg-grid">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#0d0d12]/60 backdrop-blur-xl border border-[#1a1a25] rounded-3xl p-8 shadow-2xl relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center glow-indigo">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            CareerMind <span className="gradient-text">AI</span>
          </span>
        </div>

        {/* Error Notification */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-2"
          >
            <ShieldAlert size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-red-300">{error}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Forgot Password?
              </h1>
              <p className="text-sm text-[#55556a] mb-6">
                Enter your registered username or email address and we'll send you a 6-digit verification code (OTP) to reset your password.
              </p>

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-[#9898b0] mb-2 uppercase tracking-wider">Email or Username</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55556a]" />
                    <input
                      type="text"
                      required
                      value={emailOrUsername}
                      onChange={e => setEmailOrUsername(e.target.value)}
                      placeholder="johndoe@example.com"
                      className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.01, boxShadow: '0 0 25px rgba(99,102,241,0.35)' } : {}}
                  whileTap={!isLoading ? { scale: 0.99 } : {}}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? 'Sending Verification Code...' : 'Send Verification Code'}
                </motion.button>

                <div className="flex justify-center mt-4">
                  <Link to="/login" className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                    <ArrowLeft size={13} /> Back to Sign In
                  </Link>
                </div>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Reset Your Password
              </h1>
              <p className="text-sm text-emerald-400 mb-6 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-lg text-center text-xs">
                {successMsg}
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* OTP Code */}
                <div>
                  <label className="block text-xs font-semibold text-[#9898b0] mb-2 uppercase tracking-wider">6-Digit Verification Code</label>
                  <div className="relative">
                    <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55556a]" />
                    <input
                      type="text"
                      required
                      maxLength="6"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-xl pl-10 pr-4 py-3 text-sm text-white tracking-widest font-semibold placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all text-center"
                    />
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-[#9898b0] mb-2 uppercase tracking-wider">New Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#55556a]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
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

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.01, boxShadow: '0 0 25px rgba(99,102,241,0.35)' } : {}}
                  whileTap={!isLoading ? { scale: 0.99 } : {}}
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </motion.button>

                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-xs text-[#55556a] hover:text-white transition-colors"
                  >
                    Change Email/User
                  </button>
                  <Link to="/login" className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                    Back to Sign In
                  </Link>
                </div>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={36} className="text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Password Updated!
              </h1>
              <p className="text-sm text-[#55556a] mb-8 leading-relaxed">
                Your password has been changed successfully. You can now use your new credentials to sign in.
              </p>

              <motion.button
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.01, boxShadow: '0 0 25px rgba(99,102,241,0.35)' }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-sm font-semibold text-white transition-all"
              >
                Go to Sign In
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
