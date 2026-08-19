import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { 
  Terminal, Play, Clock, 
  Trophy, Zap, Swords, Copy,
  AlertCircle, X, TrendingUp, HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const QUESTIONS = {
  coding: {
    easy: { title: 'Two Sum Problem', desc: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', defaultCode: 'def twoSum(nums, target):\n    # Write your highly optimized code here\n    pass' },
    medium: { title: 'Merge Intervals', desc: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.', defaultCode: 'def merge(intervals):\n    # Write your code here\n    pass' },
    hard: { title: 'N-Queens', desc: 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.', defaultCode: 'def solveNQueens(n):\n    # Write your code here\n    pass' }
  },
  quiz: {
    easy: { q: 'Which data structure uses LIFO (Last In First Out) principle?', opts: ['Queue', 'Stack', 'Linked List', 'Array'] },
    medium: { q: 'What is the time complexity of quicksort in the worst case?', opts: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'] },
    hard: { q: 'Which consistency model guarantees that all readers see the most recent write?', opts: ['Eventual', 'Causal', 'Strong', 'Monotonic'] }
  }
};

const CodingBattle = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Game States
  const [battleState, setBattleState] = useState('lobby'); // lobby, waiting, playing, finished
  const [gameMode, setGameMode] = useState('coding'); // coding, quiz
  const [difficulty, setDifficulty] = useState('easy'); // easy, medium, hard
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Play States
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins
  const [winner, setWinner] = useState(null);
  const [opponent, setOpponent] = useState(null);
  
  // WebSocket Reference
  const ws = useRef(null);

  // My Player Data
  const me = {
    name: user?.user?.username || user?.username || 'You (Player 1)',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=6366f1',
    level: 42,
    xp: user?.career_xp || 2540,
    color: '#6366f1'
  };

  // Setup WebSocket when entering waiting/playing state
  useEffect(() => {
    if ((battleState === 'waiting' || battleState === 'playing') && roomCode) {
      ws.current = new WebSocket(`ws://localhost:8000/ws/battle/${roomCode}/`);

      ws.current.onopen = () => {
        console.log('Connected to Battle Server');
        // Tell server I joined
        ws.current.send(JSON.stringify({ type: 'player_join', player: me.name }));
      };

      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log('Message from server:', data);

        if (data.action === 'player_join' && data.player !== me.name) {
          // Opponent joined!
          setOpponent({
            name: data.player,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ef4444',
            level: 45,
            xp: 2890,
            color: '#ef4444'
          });
          setBattleState('playing');
          // Tell the opponent that we are also here and send the game config
          ws.current.send(JSON.stringify({ type: 'sync_state', player: me.name, mode: gameMode, difficulty: difficulty }));
        } else if (data.action === 'sync_state' && data.player !== me.name) {
          // Received sync from the host/first player
          setOpponent({
            name: data.player,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=ef4444',
            level: 45,
            xp: 2890,
            color: '#ef4444'
          });
          setGameMode(data.mode || 'coding');
          setDifficulty(data.difficulty || 'easy');
          if (data.mode === 'coding' && data.difficulty) {
             setCode(QUESTIONS['coding'][data.difficulty]?.defaultCode || '');
          }
          setBattleState('playing');
        } else if (data.action === 'match_finished') {
          setBattleState('analyzing');
          setTimeout(() => {
             setWinner(data.winner);
             setBattleState('finished');
          }, 3000);
        }
      };

      return () => {
        if (ws.current) ws.current.close();
      };
    }
  }, [battleState, roomCode]);

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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleTimeUp = () => {
    if (ws.current) {
      ws.current.send(JSON.stringify({ type: 'submit_code', player: opponent?.name || 'Draw' }));
    }
  };

  const handleSubmit = () => {
    if (battleState !== 'playing') return;
    if (ws.current) {
      ws.current.send(JSON.stringify({ type: 'submit_code', player: me.name }));
    }
  };

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = (mode) => {
    setGameMode(mode);
    setRoomCode(generateRoomCode());
    if (mode === 'coding') {
       setCode(QUESTIONS['coding'][difficulty].defaultCode);
    }
    setBattleState('waiting');
  };

  const handleJoinRoom = () => {
    if (joinCode.length > 0) {
      setRoomCode(joinCode.toUpperCase());
      setBattleState('waiting');
    }
  };

  // LOBBY UI
  if (battleState === 'lobby') {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 w-full h-96 bg-indigo-500/10 blur-[100px] pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="z-10 max-w-2xl w-full">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
              <Swords size={40} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold font-sans tracking-tight mb-3">Multiplayer Arena</h1>
            <p className="text-gray-400 mb-6">Challenge friends or random opponents to test your skills.</p>
            
            {/* Difficulty Selector */}
            <div className="flex justify-center gap-3">
               {['easy', 'medium', 'hard'].map(d => (
                 <button
                   key={d}
                   onClick={() => setDifficulty(d)}
                   className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-xs transition-all ${
                     difficulty === d 
                       ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' 
                       : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                   }`}
                 >
                   {d}
                 </button>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Create Room - Coding */}
            <button 
              onClick={() => handleCreateRoom('coding')}
              className="bg-[#11111a] border border-white/10 hover:border-indigo-500/50 p-6 rounded-2xl text-left transition-all hover:-translate-y-1 group"
            >
              <Terminal size={28} className="text-indigo-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Play Coding</h3>
              <p className="text-sm text-gray-400">1v1 real-time DSA algorithms battle.</p>
              <div className="mt-4 text-xs font-bold text-indigo-400 uppercase tracking-wider">Create Room &rarr;</div>
            </button>

            {/* Create Room - Quiz */}
            <button 
              onClick={() => handleCreateRoom('quiz')}
              className="bg-[#11111a] border border-white/10 hover:border-emerald-500/50 p-6 rounded-2xl text-left transition-all hover:-translate-y-1 group"
            >
              <HelpCircle size={28} className="text-emerald-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Play Quiz</h3>
              <p className="text-sm text-gray-400">Fast-paced MCQ battle on CS concepts.</p>
              <div className="mt-4 text-xs font-bold text-emerald-400 uppercase tracking-wider">Create Room &rarr;</div>
            </button>
          </div>

          <div className="bg-[#11111a] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <input 
              type="text" 
              placeholder="Enter Room Code (e.g. X7B9K2)" 
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="flex-1 bg-[#1a1a25] border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-indigo-500 uppercase font-mono"
            />
            <button 
              onClick={handleJoinRoom}
              className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              Join Room
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

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
          <div className={`p-2 rounded-lg border ${gameMode === 'coding' ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'}`}>
            {gameMode === 'coding' ? <Terminal size={20} /> : <HelpCircle size={20} />}
          </div>
          <div>
            <h1 className="font-bold text-md tracking-wide uppercase">1v1 {gameMode} BATTLE</h1>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">Room ID: #{roomCode}</p>
              <span className="text-[10px] bg-white/10 px-2 rounded uppercase text-white font-bold">{difficulty}</span>
            </div>
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
          onClick={() => {
            if (ws.current) ws.current.close();
            setBattleState('lobby');
          }}
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
                <div className="bg-white/10 px-6 py-3 rounded-xl border border-white/20 flex flex-col items-center mt-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Share this code with your friend</p>
                  <div className="flex items-center gap-3">
                    <p className="text-3xl font-mono font-bold text-indigo-400">{roomCode}</p>
                    <button 
                      onClick={() => navigator.clipboard.writeText(roomCode)}
                      className="p-2 bg-indigo-500/20 hover:bg-indigo-500/40 rounded-lg transition-colors group relative"
                      title="Copy Code"
                    >
                      <Copy size={20} className="text-indigo-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyzing Overlay */}
          <AnimatePresence>
            {battleState === 'analyzing' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-24 h-24 relative mb-6">
                  <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full" />
                  <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <Zap size={32} className="text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">AI Analyzing Submissions...</h2>
                <p className="text-gray-400">Evaluating time complexity, logic, and speed.</p>
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
                
                <p className="text-xl text-gray-300 mb-6">
                  {winner === me.name ? 'You crushed your opponent!' : `${winner} won the battle.`}
                </p>

                {/* AI Analysis Feedback */}
                <div className="bg-[#15151e] border border-indigo-500/30 rounded-xl p-4 mb-8 text-left max-w-md mx-auto relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                   <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                     <Zap size={14} /> AI Analysis
                   </p>
                   <p className="text-sm text-gray-300">
                     {winner === me.name 
                       ? "Your approach was highly optimized! The execution time and logic were superior. Great job maintaining clean code."
                       : "Your opponent's submission was evaluated as slightly more optimal or submitted faster. Review their solution to learn!"}
                   </p>
                </div>
                
                <div className="flex gap-4">
                  {winner === me.name && (
                    <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-400 px-6 py-3 rounded-xl font-bold flex items-center gap-2">
                      <TrendingUp size={20} /> +50 XP Gained
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      if (ws.current) ws.current.close();
                      setBattleState('lobby');
                    }}
                    className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  >
                    Return to Lobby
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {gameMode === 'coding' ? (
            <>
              {/* Problem Description Bar */}
              <div className="bg-[#15151e] border-b border-white/10 p-4">
                <h2 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
                  <Terminal size={18} /> {QUESTIONS.coding[difficulty].title}
                </h2>
                <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                  {QUESTIONS.coding[difficulty].desc}
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
                  disabled={battleState !== 'playing'}
                  className={`relative overflow-hidden group flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5`}
                >
                  <Play size={18} className="fill-current" />
                  Submit Code
                </button>
              </div>
            </>
          ) : (
            // Quiz Mode UI
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0d0d12]">
              <div className="w-full max-w-3xl">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 block">Question 1 of 5</span>
                  <h2 className="text-2xl font-bold mb-6 leading-relaxed">
                    {QUESTIONS.quiz[difficulty].q}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {QUESTIONS.quiz[difficulty].opts.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedOption(i)}
                        className={`p-4 rounded-xl text-left font-medium transition-all group flex items-center justify-between border ${
                          selectedOption === i 
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/20' 
                            : 'bg-black/50 hover:bg-white/10 border-white/10 hover:border-emerald-500/50'
                        }`}
                      >
                        {opt}
                        <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                          selectedOption === i 
                            ? 'border-emerald-500 bg-emerald-500' 
                            : 'border-white/20 group-hover:border-emerald-500'
                        }`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                   <button
                    onClick={handleSubmit}
                    disabled={battleState !== 'playing' || selectedOption === null}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0`}
                  >
                    Submit Answer &rarr;
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Player 2 */}
        <aside className="w-64 flex-shrink-0 flex flex-col justify-center hidden md:flex">
          {opponent ? (
            <PlayerCard player={opponent} isOpponent={true} />
          ) : (
            <div className="h-[300px] border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center p-6 text-center">
              <p className="text-gray-500">Waiting for Opponent...</p>
            </div>
          )}
        </aside>

      </main>
    </div>
  );
};

export default CodingBattle;
