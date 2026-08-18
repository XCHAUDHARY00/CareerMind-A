import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  Terminal, Play, Clock, 
  Trophy, Zap, Swords,
  AlertCircle, X, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CodingBattle = () => {
  const navigate = useNavigate();
  
  // States for the UI
  const [code, setCode] = useState('def twoSum(nums, target):\n    # Write your highly optimized code here\n    pass');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (300 seconds)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [battleState, setBattleState] = useState('waiting'); // waiting, playing, finished
  const [winner, setWinner] = useState(null);

  // Simulated Opponent Data
  const me = {
    name: 'You (Player 1)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=6366f1',
    level: 42,
    xp: 2540,
    color: '#6366f1' // Indigo
  };

  const opponent = {
    name: 'ShadowCoder99',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ef4444',
    level: 45,
    xp: 2890,
    color: '#ef4444' // Red
  };

  // Timer logic
  useEffect(() => {
    let timer;
    if (battleState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && battleState === 'playing') {
      handleTimeUp();
    }
    return () => clearInterval(timer);
  }, [battleState, timeLeft]);

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Start match after a small delay (Simulating opponent join)
  useEffect(() => {
    if (battleState === 'waiting') {
      const timeout = setTimeout(() => {
        setBattleState('playing');
      }, 3000); // 3 seconds wait
      return () => clearTimeout(timeout);
    }
  }, [battleState]);

  const handleTimeUp = () => {
    setBattleState('finished');
    setWinner(opponent.name); // Opponent wins by default if time runs out
  };

  const handleSubmit = () => {
    if (battleState !== 'playing') return;
    
    setIsSubmitting(true);
    
    // Simulate AI checking code delay
    setTimeout(() => {
      setIsSubmitting(false);
      setBattleState('finished');
      setWinner(me.name); // You win for submitting first in this dummy logic!
    }, 2500);
  };

  // UI Components
  const PlayerCard = ({ player, isOpponent }) => (
    <motion.div 
      initial={{ opacity: 0, x: isOpponent ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative p-5 rounded-2xl border bg-[#11111a] flex flex-col items-center justify-center gap-3`}
      style={{ borderColor: `${player.color}40`, boxShadow: `0 0 20px ${player.color}10` }}
    >
      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 px-2 py-1 rounded-md border border-white/5">
        <Zap size={12} color={player.color} />
        <span className="text-[10px] text-gray-400 font-mono">Lvl {player.level}</span>
      </div>

      <div className="relative">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 p-1" style={{ borderColor: player.color }}>
          <img src={player.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover bg-gray-800" />
        </div>
        {battleState === 'playing' && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-2 border-[#11111a]"
          />
        )}
      </div>

      <div className="text-center">
        <h3 className="text-white font-bold text-lg">{player.name}</h3>
        <p className="text-xs text-gray-400 mt-1">{player.xp} XP</p>
      </div>

      {/* HP / Progress Bar Simulation */}
      <div className="w-full mt-4 bg-gray-800 h-2 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: battleState === 'playing' ? '80%' : '100%' }}
          className="h-full rounded-full"
          style={{ backgroundColor: player.color }}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col font-sans overflow-hidden">
      
      {/* Top Navbar */}
      <header className="h-16 border-b border-white/10 bg-[#0f0f13] flex items-center justify-between px-6 z-10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
            <Swords size={20} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="font-bold text-md tracking-wide">1v1 RANKED BATTLE</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Room ID: #X7B9K2</p>
          </div>
        </div>

        {/* Central Timer */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black border border-white/10 px-5 py-2 rounded-full shadow-lg">
          <Clock size={16} className={timeLeft <= 60 ? 'text-red-500 animate-pulse' : 'text-emerald-400'} />
          <span className={`text-xl font-mono font-bold tracking-widest ${timeLeft <= 60 ? 'text-red-500' : 'text-white'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>

        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/5"
        >
          <X size={16} /> Flee Battle
        </button>
      </header>

      {/* Main Battle Arena */}
      <main className="flex-1 flex gap-4 p-4 h-[calc(100vh-4rem)] relative">
        
        {/* Left Side: Player 1 */}
        <aside className="w-64 flex-shrink-0 flex flex-col justify-center hidden md:flex">
          <PlayerCard player={me} isOpponent={false} />
        </aside>

        {/* Center: IDE / Action Area */}
        <div className="flex-1 flex flex-col border border-white/10 rounded-2xl overflow-hidden bg-[#0d0d12] shadow-2xl relative">
          
          {/* Waiting Overlay */}
          <AnimatePresence>
            {battleState === 'waiting' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center"
              >
                <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6" />
                <h2 className="text-3xl font-bold mb-2">Waiting for Opponent...</h2>
                <p className="text-gray-400 font-mono">Share Room ID: X7B9K2</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Finished Overlay */}
          <AnimatePresence>
            {battleState === 'finished' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
              >
                <motion.div 
                  initial={{ y: 20 }} animate={{ y: 0 }}
                  className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 border-4 shadow-2xl ${
                    winner === me.name ? 'bg-indigo-500/20 border-indigo-400 shadow-indigo-500/50' : 'bg-red-500/20 border-red-400 shadow-red-500/50'
                  }`}
                >
                  <Trophy size={64} className={winner === me.name ? 'text-indigo-400' : 'text-red-400'} />
                </motion.div>
                
                <h1 className="text-5xl font-extrabold mb-4 uppercase tracking-wider">
                  {winner === me.name ? 'VICTORY' : 'DEFEAT'}
                </h1>
                
                <p className="text-xl text-gray-300 mb-8">
                  {winner === me.name ? 'Your code was optimal and faster!' : 'Opponent submitted a better solution.'}
                </p>
                
                <div className="flex gap-4">
                  {winner === me.name && (
                    <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-400 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                      <TrendingUp size={20} /> +50 XP Gained
                    </div>
                  )}
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Return to Lobby
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Problem Description Bar */}
          <div className="bg-[#15151e] border-b border-white/10 p-4">
            <h2 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
              <Terminal size={18} /> Two Sum Problem
            </h2>
            <p className="text-sm text-gray-400 mt-1 line-clamp-1">
              Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
            </p>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                padding: { top: 20 },
                scrollBeyondLastLine: false,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace"
              }}
            />
          </div>

          {/* Bottom Action Bar */}
          <div className="bg-[#15151e] border-t border-white/10 p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-md text-xs font-mono text-gray-400 flex items-center gap-2">
                <AlertCircle size={14} /> Python 3.10
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || battleState !== 'playing'}
              className={`relative overflow-hidden group flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg
                ${isSubmitting ? 'bg-indigo-600/50 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5'}
              `}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI Evaluating...
                </>
              ) : (
                <>
                  <Play size={18} className="fill-current" />
                  Submit Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Player 2 */}
        <aside className="w-64 flex-shrink-0 flex flex-col justify-center hidden md:flex">
          <PlayerCard player={opponent} isOpponent={true} />
        </aside>

      </main>
    </div>
  );
};

export default CodingBattle;
