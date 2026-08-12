import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Play, Timer, ChevronRight, Star, MessageSquare, TrendingUp, Loader, AlertCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import api from '../api';

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
  
  // Active Interview Session State
  const [sessionId, setSessionId] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [isCoding, setIsCoding] = useState(false);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Results & Last History State
  const [result, setResult] = useState(null);
  const [lastInterview, setLastInterview] = useState(null);
  const [loadingLast, setLoadingLast] = useState(true);

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const recognitionRef = useRef(null);

  // Fetch last completed interview details
  const fetchLastInterview = async () => {
    try {
      setLoadingLast(true);
      const response = await api.get('/interview/last/');
      if (response.data.status === 'success' && response.data.data) {
        setLastInterview(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching last interview:", err);
    } finally {
      setLoadingLast(false);
    }
  };

  useEffect(() => {
    fetchLastInterview();
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (phase !== 'active' || timeLeft <= 0 || isLoading) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto submit answer when timer runs out
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, timeLeft, isLoading]);

  // Speech recognition controller
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Voice input is not supported in this browser. Please use Chrome or Safari.");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      rec.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(res => res[0].transcript)
          .join('');
        setAnswer(prev => prev ? prev + ' ' + transcript : transcript);
      };

      rec.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error !== 'no-speech') {
          setSpeechError(`Speech error: ${event.error}`);
          setIsListening(false);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.error(e);
      setSpeechError("Could not access microphone.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Actions
  const handleStartInterview = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/interview/start/', {
        target_role: role,
        difficulty: difficulty,
        interview_type: interviewType
      });
      if (response.data.status === 'success') {
        setSessionId(response.data.session_id);
        setCurrentQuestionText(response.data.first_question);
        setIsCoding(response.data.is_coding);
        setCurrentQ(0);
        setTimeLeft(120);
        setAnswer('');
        setPhase('active');
      } else {
        setError(response.data.message || "Failed to start interview.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to start the interview session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/interview/answer/', {
        session_id: sessionId,
        answer_text: answer
      });
      if (response.data.status === 'success') {
        if (response.data.completed) {
          // Finalize scores
          const endResponse = await api.post('/interview/end/', { session_id: sessionId });
          if (endResponse.data.status === 'success') {
            setResult(endResponse.data);
            setPhase('result');
            fetchLastInterview();
          } else {
            setError(endResponse.data.message || "Failed to finalize scores.");
          }
        } else {
          setCurrentQuestionText(response.data.next_question);
          setIsCoding(response.data.is_coding);
          setCurrentQ(q => q + 1);
          setAnswer('');
          setTimeLeft(120);
        }
      } else {
        setError(response.data.message || "Failed to submit answer.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to submit answer. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipQuestion = () => {
    setAnswer('[Skipped]');
    // Submit as skipped
    setTimeout(() => {
      handleNextQuestion();
    }, 50);
  };

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
              <p className="text-6xl font-bold gradient-text mb-1">{result?.scores?.overall || result?.score || 0}</p>
              <p className="text-sm text-[#55556a]">out of 100</p>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Technical Knowledge', score: result?.scores?.technical || result?.technical || 0, color: '#6366f1' },
                { label: 'Communication', score: result?.scores?.communication || result?.communication || 0, color: '#8b5cf6' },
                { label: 'Problem Solving', score: result?.scores?.problemSolving || result?.problemSolving || 0, color: '#3b82f6' },
                { label: 'Clarity', score: result?.scores?.clarity || result?.clarity || 0, color: '#14b8a6' },
                { label: 'Confidence', score: result?.scores?.confidence || result?.confidence || 0, color: '#f59e0b' },
              ].map(item => (
                <ScoreBar key={item.label} {...item} />
              ))}
            </div>
          </motion.div>

          {/* Overall Summary */}
          {result?.summary && (
            <div className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5 mb-5">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">AI Overall Review</p>
              <p className="text-xs text-[#9898b0] leading-relaxed">{result.summary}</p>
            </div>
          )}

          {/* AI Feedback: Strengths and Improvements */}
          <div className="bg-indigo-500/8 border border-indigo-500/20 rounded-2xl p-5 mb-5">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">Detailed Feedback</p>
            <div className="space-y-3">
              {result?.strengths && result.strengths.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-emerald-400 mb-1">Key Strengths</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {result.strengths.map((str, idx) => (
                      <li key={idx} className="text-xs text-[#9898b0] leading-relaxed">{str}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result?.areas_to_improve && result.areas_to_improve.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-amber-400 mb-1">Areas to Improve</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {result.areas_to_improve.map((area, idx) => (
                      <li key={idx} className="text-xs text-[#9898b0] leading-relaxed">{area}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <button
            id="interview-restart-btn"
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
          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          {/* Timer + progress */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#0d0d12] border border-[#1a1a25] rounded-xl">
              <Timer size={14} className="text-indigo-400" />
              <span className="text-sm font-bold text-white">
                {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#55556a]">Question {currentQ + 1} of 5</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(i => (
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
            className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-6 mb-5 relative overflow-hidden"
          >
            {isLoading && (
              <div className="absolute inset-0 bg-[#0d0d12]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
                <Loader size={24} className="animate-spin text-indigo-400" />
                <p className="text-xs text-[#9898b0] animate-pulse">
                  {currentQ < 4 ? "AI is evaluating your answer..." : "Hiring manager is finalizing your scorecard..."}
                </p>
              </div>
            )}

            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 relative">
                {isListening ? (
                  <div className="absolute inset-0 rounded-2xl bg-red-500/20 animate-ping" />
                ) : null}
                <motion.div
                  animate={isListening ? { scale: [1, 1.2, 1] } : { scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Mic size={20} className={isListening ? "text-red-400" : "text-white"} />
                </motion.div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-indigo-400 font-semibold">AI Interviewer</p>
                  {isCoding && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1e1b4b] border border-indigo-500/30 text-indigo-300">
                      Coding Challenge
                    </span>
                  )}
                </div>
                <p className="text-sm text-white leading-relaxed">{currentQuestionText}</p>
              </div>
            </div>

            <textarea
              id={isCoding ? "coding-answer-input" : "interview-answer-input"}
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              disabled={isLoading}
              placeholder={
                isCoding
                  ? "Write your code snippet or function here..."
                  : "Type your answer here... Or use the Speak button below to talk."
              }
              rows={6}
              className="w-full bg-[#111118] border border-[#1a1a25] rounded-xl px-4 py-3 text-sm text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all resize-none font-mono"
            />

            {/* Voice Input Controls */}
            {!isCoding && (
              <div className="flex flex-col gap-2 mt-4">
                <div className="flex items-center gap-3">
                  <button
                    id="interview-speak-btn"
                    type="button"
                    onMouseDown={startListening}
                    onMouseUp={stopListening}
                    onTouchStart={startListening}
                    onTouchEnd={stopListening}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all select-none ${
                      isListening
                        ? 'bg-red-500/20 border border-red-500/40 text-red-300 scale-95 shadow-lg shadow-red-500/10'
                        : 'bg-[#111118] border border-[#1a1a25] text-[#9898b0] hover:text-white hover:border-[#2a2a38] active:scale-95'
                    }`}
                  >
                    <Mic size={14} className={isListening ? "animate-pulse text-red-400" : ""} />
                    {isListening ? "Listening... Release to stop" : "Hold to Speak Answer"}
                  </button>
                </div>
                {speechError && (
                  <p className="text-[10px] text-red-400">{speechError}</p>
                )}
              </div>
            )}
          </motion.div>

          <div className="flex gap-3">
            <button
              id="interview-submit-btn"
              onClick={handleNextQuestion}
              disabled={isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {currentQ < 4 ? (
                <>
                  Submit Answer <ChevronRight size={15} />
                </>
              ) : (
                "Finish Interview"
              )}
            </button>
            <button
              id="interview-skip-btn"
              onClick={handleSkipQuestion}
              disabled={isLoading}
              className="px-5 py-3 border border-[#1a1a25] rounded-xl text-xs text-[#55556a] hover:text-white hover:border-[#2a2a38] transition-all disabled:opacity-50"
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
        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-400">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Past score */}
        {loadingLast ? (
          <div className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-4 mb-6 flex items-center justify-center gap-2">
            <Loader size={14} className="animate-spin text-indigo-400" />
            <span className="text-xs text-[#55556a]">Loading recent interview history...</span>
          </div>
        ) : lastInterview ? (
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
              <p className="text-lg font-bold text-white">
                {lastInterview.score}/100 <span className="text-xs text-[#55556a]">· {lastInterview.target_role} ({lastInterview.date})</span>
              </p>
            </div>
            <button
              id="interview-details-btn"
              onClick={() => {
                setResult(lastInterview);
                setPhase('result');
              }}
              className="ml-auto text-xs text-indigo-400 hover:text-indigo-300"
            >
              View Details →
            </button>
          </motion.div>
        ) : null}

        {/* Setup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-6 space-y-5 relative overflow-hidden"
        >
          {isLoading && (
            <div className="absolute inset-0 bg-[#0d0d12]/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <Loader size={24} className="animate-spin text-indigo-400" />
              <p className="text-xs text-[#9898b0] animate-pulse">Initializing interview session...</p>
            </div>
          )}

          <h2 className="text-base font-semibold text-white">Configure Your Interview</h2>

          {[
            { label: 'Target Role', value: role, options: ['Backend Developer', 'Full Stack Developer', 'AI Engineer', 'Data Scientist'], setter: setRole },
            { label: 'Difficulty', value: difficulty, options: ['Easy', 'Medium', 'Hard'], setter: setDifficulty },
            { label: 'Interview Type', value: interviewType, options: ['Technical', 'Behavioral', 'Mixed'], setter: setInterviewType },
          ].map(field => (
            <div key={field.label}>
              <label className="block text-xs font-semibold text-[#9898b0] uppercase tracking-wider mb-2">
                {field.label}
              </label>
              <div className="flex flex-wrap gap-2">
                {field.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => field.setter(opt)}
                    disabled={isLoading}
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
            id="interview-start-btn"
            onClick={handleStartInterview}
            disabled={isLoading}
            whileHover={isLoading ? {} : { scale: 1.01, boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}
            whileTap={isLoading ? {} : { scale: 0.99 }}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-50"
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
