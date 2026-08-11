import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, Timer, ChevronRight, Star, MessageSquare, TrendingUp } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import { mockInterviewHistory } from '../data/mockData';

const ScoreBar = ({ label, score, color }) => (
  <div>
    <div className="flex justify-between text-xs text-[#9898b0] mb-1.5">
      <span>{label}</span>
      <span className="font-semibold text-white">{score}</span>
    </div>
    <div className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

const MockInterview = () => {
  const [phase, setPhase] = useState('setup'); // setup | active | result
  const [role, setRole] = useState('Backend Developer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [interviewType, setInterviewType] = useState('Technical');
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);

  const questions = [
    "Tell me about a backend project you built and the key challenges you faced.",
    "How would you design a REST API for a social media platform?",
    "Explain the difference between synchronous and asynchronous programming.",
    "How do you handle database optimization in a Django application?",
  ];

  const result = mockInterviewHistory[0];

  if (phase === 'result') {
    return (
      <AppLayout title="Interview Result" subtitle="Your performance breakdown">
        <div className="p-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-6 mb-5"
          >
            <div className="text-center mb-6">
              <p className="text-xs text-[#55556a] uppercase tracking-wider mb-2">Interview Score</p>
              <p className="text-6xl font-bold gradient-text mb-1">{result.score}</p>
              <p className="text-sm text-[#55556a]">out of 100</p>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Technical Knowledge', score: result.technical, color: '#6366f1' },
                { label: 'Communication', score: result.communication, color: '#8b5cf6' },
                { label: 'Problem Solving', score: result.problemSolving, color: '#3b82f6' },
                { label: 'Clarity', score: result.clarity, color: '#14b8a6' },
                { label: 'Confidence', score: result.confidence, color: '#f59e0b' },
              ].map(item => (
                <ScoreBar key={item.label} {...item} />
              ))}
            </div>
          </motion.div>

          {/* AI Feedback */}
          <div className="bg-indigo-500/8 border border-indigo-500/20 rounded-2xl p-5 mb-5">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">AI Feedback</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-emerald-400 mb-1">Strengths</p>
                <p className="text-xs text-[#9898b0] leading-relaxed">Strong technical knowledge of Django and REST API design. Good code examples in your answers.</p>
              </div>
              <div>
                <p className="text-xs font-medium text-amber-400 mb-1">Areas to Improve</p>
                <p className="text-xs text-[#9898b0] leading-relaxed">Communication could be more structured — try the STAR method. Confidence in system design needs practice.</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setPhase('setup')}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-sm font-semibold text-white transition-all"
          >
            Practice Again
          </button>
        </div>
        <AIAssistant />
      </AppLayout>
    );
  }

  if (phase === 'active') {
    return (
      <AppLayout title="Mock Interview" subtitle="Be confident. Take your time.">
        <div className="p-6 max-w-3xl mx-auto">
          {/* Timer + progress */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#0d0d12] border border-[#1a1a25] rounded-xl">
              <Timer size={14} className="text-indigo-400" />
              <span className="text-sm font-bold text-white">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#55556a]">Question {currentQ + 1} of {questions.length}</span>
              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i <= currentQ ? 'bg-indigo-500' : 'bg-[#1a1a25]'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* AI Avatar + Question */}
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-6 mb-5"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Mic size={20} className="text-white" />
                </motion.div>
              </div>
              <div>
                <p className="text-xs text-indigo-400 font-semibold mb-1">AI Interviewer</p>
                <p className="text-sm text-white leading-relaxed">{questions[currentQ]}</p>
              </div>
            </div>

            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Type your answer here... Be specific and use examples from your projects."
              rows={6}
              className="w-full bg-[#111118] border border-[#1a1a25] rounded-xl px-4 py-3 text-sm text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all resize-none"
            />
          </motion.div>

          <div className="flex gap-3">
            {currentQ < questions.length - 1 ? (
              <button
                onClick={() => { setCurrentQ(q => q + 1); setAnswer(''); }}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl text-sm font-semibold text-white transition-all hover:from-indigo-600 hover:to-violet-700"
              >
                Submit Answer <ChevronRight size={15} className="inline ml-1" />
              </button>
            ) : (
              <button
                onClick={() => setPhase('result')}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-sm font-semibold text-white transition-all"
              >
                Finish Interview
              </button>
            )}
            <button
              onClick={() => { setCurrentQ(q => Math.min(q + 1, questions.length - 1)); setAnswer(''); }}
              className="px-5 py-3 border border-[#1a1a25] rounded-xl text-xs text-[#55556a] hover:text-white hover:border-[#2a2a38] transition-all"
            >
              Skip
            </button>
          </div>
        </div>
        <AIAssistant />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Mock Interview" subtitle="Practice with AI. Get real feedback.">
      <div className="p-6 max-w-3xl mx-auto">
        {/* Past score */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-4 mb-6 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Star size={16} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-[#55556a]">Last Interview Score</p>
              <p className="text-lg font-bold text-white">{result.score}/100 <span className="text-xs text-[#55556a]">· {result.role}</span></p>
            </div>
            <button onClick={() => setPhase('result')} className="ml-auto text-xs text-indigo-400 hover:text-indigo-300">View Details →</button>
          </motion.div>
        )}

        {/* Setup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-6 space-y-5"
        >
          <h2 className="text-base font-semibold text-white">Configure Your Interview</h2>

          {[
            { label: 'Target Role', value: role, options: ['Backend Developer', 'Full Stack Developer', 'AI Engineer', 'Data Scientist'], setter: setRole },
            { label: 'Difficulty', value: difficulty, options: ['Easy', 'Medium', 'Hard'], setter: setDifficulty },
            { label: 'Interview Type', value: interviewType, options: ['Technical', 'Behavioral', 'Mixed'], setter: setInterviewType },
          ].map(field => (
            <div key={field.label}>
              <label className="block text-xs font-semibold text-[#9898b0] uppercase tracking-wider mb-2">{field.label}</label>
              <div className="flex flex-wrap gap-2">
                {field.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => field.setter(opt)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                      field.value === opt
                        ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                        : 'border border-[#1a1a25] text-[#55556a] hover:text-white hover:border-[#2a2a38]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <motion.button
            onClick={() => setPhase('active')}
            whileHover={{ scale: 1.01, boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all mt-2"
          >
            <Play size={15} className="fill-current" /> Start Interview
          </motion.button>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5 grid grid-cols-3 gap-3"
        >
          {[
            { icon: <MessageSquare size={14} />, label: 'Use the STAR method for behavioral questions' },
            { icon: <TrendingUp size={14} />, label: 'Reference your actual projects for examples' },
            { icon: <Timer size={14} />, label: 'Take 5–10 seconds before answering each question' },
          ].map((tip, i) => (
            <div key={i} className="bg-[#0d0d12] border border-[#1a1a25] rounded-xl p-3 flex flex-col gap-2">
              <div className="text-indigo-400">{tip.icon}</div>
              <p className="text-[10px] text-[#55556a] leading-relaxed">{tip.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
      <AIAssistant />
    </AppLayout>
  );
};

export default MockInterview;
