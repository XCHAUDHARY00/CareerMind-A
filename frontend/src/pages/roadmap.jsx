import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, Clock, ArrowRight, Sparkles, ChevronDown, ChevronUp, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import api from '../api';
import { mockRoadmap } from '../data/mockData';

// ─── API fetch function ───────────────────────────────────────────────────────
const fetchRoadmap = async () => {
  try {
    const res = await api.get('/roadmap/');
    if (res.data?.status !== 'success') {
      throw new Error(res.data?.message || 'Failed to load Roadmap');
    }
    return res.data.data; // This is the JSON object: { roadmap: [...] }
  } catch (err) {
    // Extract actual backend error message instead of "Request failed with status 500"
    throw new Error(err.response?.data?.message || err.message || 'Server error occurred');
  }
};

const Roadmap = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('30');
  const [expandedWeeks, setExpandedWeeks] = useState({ 1: true, 2: true });
  const [isForceRefreshing, setIsForceRefreshing] = useState(false);

  // React Query hook
  const {
    data: roadmapData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['roadmap'],
    queryFn: fetchRoadmap,
  });

  const handleForceRefresh = async () => {
    try {
      setIsForceRefreshing(true);
      await api.get('/roadmap/?force=true'); // Force new AI generation
      await queryClient.invalidateQueries({ queryKey: ['roadmap'] }); // Refresh UI
    } catch (err) {
      console.error("Failed to force refresh", err);
    } finally {
      setIsForceRefreshing(false);
    }
  };

  const toggleWeek = (week) => {
    setExpandedWeeks(prev => ({ ...prev, [week]: !prev[week] }));
  };

  const aiRoadmapSteps = roadmapData?.roadmap || [];
  
  // Decide what to display (Fallback to mock if error or no data)
  const isMock = isError || (!isLoading && aiRoadmapSteps.length === 0);

  // If using AI data, we map 'steps' to 'weeks' for the UI tabs
  const itemsToShow = activeTab === '30' ? 1 : activeTab === '60' ? 2 : 3; // 30 days = 1 month/step etc (depends on how we map it)
  // Let's just show all AI steps if they exist, else filter mock weeks
  const mockWeeksToShow = activeTab === '30' ? [0, 1] : activeTab === '60' ? [0, 1, 2] : [0, 1, 2, 3];

  return (
    <AppLayout title="Career Roadmap" subtitle="Your personalized step-by-step plan">
      <div className="p-6 max-w-4xl mx-auto">

        {/* Error banner */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3 mb-5 bg-amber-500/10 border border-amber-500/25 rounded-xl"
          >
            <AlertCircle size={15} className="text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-300">{error?.message || 'Failed to load AI roadmap. Showing demo data.'}</p>
            <button onClick={() => refetch()} className="ml-auto flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium">
              <RefreshCw size={11} /> Retry
            </button>
          </motion.div>
        )}

        {/* Progress & Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Your Career Roadmap</h2>
              <p className="text-xs text-[#55556a] mt-0.5">Custom AI-generated path</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Background fetching indicator */}
              {isFetching && !isLoading && (
                <span className="flex items-center gap-1.5 text-[10px] text-indigo-400">
                  <RefreshCw size={10} className="animate-spin" /> updating...
                </span>
              )}
              
              {!isLoading && !isMock && (
                <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] text-emerald-400 font-medium flex items-center gap-1.5">
                  <Sparkles size={10} /> AI Analyzed
                </span>
              )}

              {/* Force refresh */}
              {!isLoading && !isFetching && (
                <button
                  onClick={handleForceRefresh}
                  disabled={isForceRefreshing}
                  title="Generate New Roadmap"
                  className="p-1.5 rounded-lg border border-[#1a1a25] text-[#55556a] hover:text-indigo-300 hover:border-indigo-500/30 transition-all disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isForceRefreshing ? "animate-spin text-indigo-400" : ""} />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
              <div className="h-full w-[15%] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
            </div>
            <span className="text-xs text-[#55556a] whitespace-nowrap">Step 1 in progress</span>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-[#1a1a25] to-transparent" />

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="pl-14">
                  <div className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5 animate-pulse h-24" />
                </div>
              ))}
            </div>
          ) : !isMock ? (
            // ─── Render AI Data ──────────────────────────────────────────────────────────
            <div className="space-y-4">
              {aiRoadmapSteps.map((step, idx) => (
                <motion.div
                  key={step.step || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-14"
                >
                  {/* Step dot */}
                  <div className={`absolute left-4 top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    idx === 0 ? 'border-indigo-500 bg-indigo-500' : 'border-[#2a2a38] bg-[#0d0d12]'
                  }`}>
                    {idx === 0 && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  <div className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl overflow-hidden">
                    <button
                      onClick={() => toggleWeek(`ai_${idx}`)}
                      className="w-full flex items-center justify-between p-4 hover:bg-[#111118] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-start text-left">
                          <span className="text-[10px] text-[#55556a] font-medium">Step {step.step || idx + 1} • {step.estimated_time}</span>
                          <span className="text-sm font-semibold text-white">{step.title}</span>
                        </div>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-[10px] text-indigo-300 font-semibold">
                            Current
                          </span>
                        )}
                      </div>
                      {expandedWeeks[`ai_${idx}`] ? <ChevronUp size={16} className="text-[#55556a]" /> : <ChevronDown size={16} className="text-[#55556a]" />}
                    </button>

                    {expandedWeeks[`ai_${idx}`] && (
                      <div className="border-t border-[#1a1a25] p-4 bg-[#111118]">
                        <p className="text-sm text-[#9898b0] leading-relaxed mb-4">{step.description}</p>
                        
                        {step.resources && step.resources.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-[#55556a] uppercase tracking-wider mb-2">Recommended Resources</p>
                            {step.resources.map((res, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 bg-[#0d0d12] border border-[#1a1a25] rounded-xl">
                                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                                  <BookOpen size={14} />
                                </div>
                                <p className="text-xs text-white">{res}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {idx === 0 && (
                          <button className="mt-5 w-full flex items-center justify-center gap-2 py-2 bg-indigo-500/20 border border-indigo-500/30 hover:bg-indigo-500/30 rounded-xl text-xs font-semibold text-indigo-300 transition-all">
                            Start Learning <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // ─── Render Mock Data (Fallback) ─────────────────────────────────────────────
            <div className="space-y-4">
              <div className="pl-14 mb-4 flex gap-2">
                {['30', '60', '90'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === tab
                        ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                        : 'border border-[#1a1a25] text-[#55556a] hover:text-white'
                    }`}
                  >
                    {tab} Days
                  </button>
                ))}
              </div>
              
              {mockRoadmap.weeks.slice(0, mockWeeksToShow.length === 2 ? 2 : mockWeeksToShow.length === 3 ? 3 : 4).map((week, wi) => (
                <motion.div
                  key={week.week}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: wi * 0.1 }}
                  className="relative pl-14"
                >
                  <div className={`absolute left-4 top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    week.week === 1 ? 'border-indigo-500 bg-indigo-500' : 'border-[#2a2a38] bg-[#0d0d12]'
                  }`}>
                    {week.week === 1 && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  <div className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl overflow-hidden">
                    <button
                      onClick={() => toggleWeek(week.week)}
                      className="w-full flex items-center justify-between p-4 hover:bg-[#111118] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-start">
                          <span className="text-[10px] text-[#55556a] font-medium">Week {week.week}</span>
                          <span className="text-sm font-semibold text-white">{week.focus}</span>
                        </div>
                        {week.week === 1 && (
                          <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-[10px] text-indigo-300 font-semibold">
                            Current
                          </span>
                        )}
                      </div>
                      {expandedWeeks[week.week] ? <ChevronUp size={16} className="text-[#55556a]" /> : <ChevronDown size={16} className="text-[#55556a]" />}
                    </button>

                    {expandedWeeks[week.week] && (
                      <div className="border-t border-[#1a1a25] divide-y divide-[#1a1a25]">
                        {week.tasks.map((task, ti) => (
                          <div key={task.id} className="flex items-center gap-4 p-4 hover:bg-[#111118] transition-colors">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                              task.status === 'done' ? 'bg-emerald-500/20' :
                              task.status === 'in-progress' ? 'bg-indigo-500/20' : 'bg-[#1a1a25]'
                            }`}>
                              {task.status === 'done' ? <CheckCircle size={14} className="text-emerald-400" /> :
                               task.status === 'in-progress' ? <div className="w-2 h-2 bg-indigo-400 rounded-full" /> :
                               <div className="w-2 h-2 bg-[#2a2a38] rounded-full" />}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                task.status === 'done' ? 'line-through text-[#55556a]' :
                                task.status === 'in-progress' ? 'text-white' : 'text-[#9898b0]'
                              }`}>{task.title}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <AIAssistant />
    </AppLayout>
  );
};

export default Roadmap;

