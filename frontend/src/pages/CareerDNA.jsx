import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { Sparkles, TrendingUp, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import api from '../api';
import { mockRadarData, mockSkills, mockCareerPaths, mockUser } from '../data/mockData';

// ─── API fetch function (React Query ke liye) ────────────────────────────────
const fetchCareerDNA = async () => {
  try {
    const res = await api.get('/carrer-dna/');
    if (res.data?.status !== 'success') {
      throw new Error(res.data?.message || 'Failed to load Career DNA');
    }
    return res.data.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Server error occurred');
  }
};

// ─── Small reusable components ───────────────────────────────────────────────
const SectionCard = ({ title, children, className = '' }) => (
  <div className={`bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5 ${className}`}>
    <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>
    {children}
  </div>
);

const SkillPill = ({ name, color }) => (
  <div className="flex items-center gap-2 px-3 py-2 bg-[#111118] border border-[#1a1a25] rounded-xl hover:border-indigo-500/30 transition-all">
    <div
      className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold"
      style={{ background: `${color}20`, color }}
    >
      {name[0]}
    </div>
    <p className="text-xs font-medium text-white">{name}</p>
  </div>
);

const SkeletonBlock = ({ h = 'h-4', w = 'w-full', rounded = 'rounded-lg' }) => (
  <div className={`${h} ${w} ${rounded} bg-[#1a1a25] animate-pulse`} />
);

// ─── Main Component ───────────────────────────────────────────────────────────
const CareerDNA = () => {
  // useQuery — React Query ka main hook
  // queryKey: ['career-dna'] → unique name for this query
  // queryFn: fetchCareerDNA → function jo data fetch karta hai
  // staleTime already set globally in App.jsx (10 min)
  const {
    data: dnaData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,       // true jab background mein refresh ho raha ho
    isStale,          // true jab 10 min baad data purana ho jaaye
  } = useQuery({
    queryKey: ['career-dna'],
    queryFn: fetchCareerDNA,
  });

  const [isForceRefreshing, setIsForceRefreshing] = useState(false);

  const handleForceRefresh = async () => {
    try {
      setIsForceRefreshing(true);
      await api.get('/carrer-dna/?force=true');
      await queryClient.invalidateQueries({ queryKey: ['career-dna'] });
    } catch (err) {
      console.error(err);
    } finally {
      setIsForceRefreshing(false);
    }
  };

  // Real data ya mock fallback
  const radarData       = dnaData?.radar_data
    ? dnaData.radar_data.map(d => ({ subject: d.subject, A: d.score }))
    : mockRadarData;
  const careerPaths     = dnaData?.career_paths    || mockCareerPaths;
  const personalityTags = dnaData?.personality_tags || ['Builder', 'Analytical', 'Problem Solver', 'Backend-First'];
  const strengths       = dnaData?.strengths        || mockSkills.filter(s => s.level >= 7).map(s => s.name);
  const growthAreas     = dnaData?.growth_areas     || mockSkills.filter(s => s.level < 6).map(s => s.name);
  const readinessScore  = dnaData?.readiness_score  || 78;
  const aiSummary       = dnaData?.ai_summary       || null;

  return (
    <AppLayout title="Career DNA" subtitle="Your professional identity, analyzed by AI">
      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* Error banner */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3 bg-amber-500/10 border border-amber-500/25 rounded-xl"
          >
            <AlertCircle size={15} className="text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-300">{error?.message || 'Failed to load. Showing demo data.'}</p>
            <button
              onClick={() => refetch()}
              className="ml-auto flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              <RefreshCw size={11} /> Retry
            </button>
          </motion.div>
        )}

        {/* ── Profile Header ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-white glow-indigo">
              R
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {mockUser.name}
              </h1>
              <p className="text-sm text-[#55556a]">
                Targeting: <span className="text-indigo-400 font-medium">{mockUser.targetRole}</span>
              </p>

              {/* Personality tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {isLoading
                  ? [1, 2, 3].map(i => <SkeletonBlock key={i} h="h-6" w="w-20" rounded="rounded-lg" />)
                  : personalityTags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-indigo-500/15 border border-indigo-500/25 rounded-lg text-[11px] text-indigo-300 font-medium">
                      {tag}
                    </span>
                  ))
                }
              </div>
            </div>

            {/* Readiness + refresh state */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <p className="text-xs text-[#55556a]">Readiness Score</p>
                {/* isFetching → background mein refresh ho raha hai */}
                {isFetching && !isLoading && (
                  <RefreshCw size={11} className="text-indigo-400 animate-spin" />
                )}
                
                {/* Force Refresh Button */}
                {!isLoading && !isFetching && (
                  <button
                    onClick={handleForceRefresh}
                    disabled={isForceRefreshing}
                    title="Force analyze DNA"
                    className="p-1.5 rounded-lg border border-[#1a1a25] text-[#55556a] hover:text-white hover:border-[#2a2a38] transition-all disabled:opacity-50 ml-2"
                  >
                    <RefreshCw size={12} className={isForceRefreshing ? "animate-spin text-indigo-400" : ""} />
                  </button>
                )}
              </div>
              {isLoading
                ? <SkeletonBlock h="h-9" w="w-20" rounded="rounded-xl" />
                : <p className="text-3xl font-bold gradient-text">{readinessScore}<span className="text-base text-[#55556a]">/100</span></p>
              }
              <div className="flex items-center gap-1 text-emerald-400">
                <TrendingUp size={12} />
                <span className="text-xs font-medium">
                  {dnaData ? '✓ AI Analyzed' : 'Demo mode'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Radar + Career Paths ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Skill Radar</h3>
              {dnaData && (
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  AI Analyzed
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-[280px]">
                <div className="w-8 h-8 border-2 border-t-indigo-500 border-indigo-500/20 rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="#1a1a25" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#55556a', fontSize: 11, fontFamily: 'Inter' }}
                  />
                  <Radar
                    name="You"
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.15}
                    strokeWidth={2}
                    dot={{ fill: '#6366f1', r: 3 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Career Path Matches */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
          >
            <h3 className="text-sm font-semibold text-white mb-4">Career Path Matches</h3>
            <div className="space-y-3">
              {isLoading
                ? [1, 2, 3, 4].map(i => <SkeletonBlock key={i} h="h-12" rounded="rounded-xl" />)
                : careerPaths.map((path, i) => (
                  <motion.div
                    key={path.role || path.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-[#1a1a25] hover:border-[#2a2a38] bg-[#111118] transition-all cursor-pointer group"
                  >
                    <span className="text-xl">{path.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-white">{path.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${path.match}%` }}
                            transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: path.color || '#6366f1' }}
                          />
                        </div>
                      </div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: path.color || '#6366f1' }}>
                      {path.match}%
                    </span>
                    <ChevronRight size={14} className="text-[#2a2a38] group-hover:text-[#55556a] transition-colors" />
                  </motion.div>
                ))
              }
            </div>
          </motion.div>
        </div>

        {/* ── Strengths / Growth / Evidence ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SectionCard title="💪 Strengths">
            <div className="flex flex-wrap gap-2">
              {isLoading
                ? [1, 2, 3].map(i => <SkeletonBlock key={i} h="h-9" w="w-24" rounded="rounded-xl" />)
                : strengths.map(name => <SkillPill key={name} name={name} color="#6366f1" />)
              }
            </div>
          </SectionCard>

          <SectionCard title="🚀 Growth Areas">
            <div className="flex flex-wrap gap-2">
              {isLoading
                ? [1, 2, 3].map(i => <SkeletonBlock key={i} h="h-9" w="w-24" rounded="rounded-xl" />)
                : growthAreas.map(name => <SkillPill key={name} name={name} color="#f59e0b" />)
              }
            </div>
          </SectionCard>

          <SectionCard title="📊 Career Evidence">
            <div className="space-y-3">
              {[
                { label: 'Projects', count: 3, icon: '🛠️', color: '#6366f1' },
                { label: 'GitHub Repos', count: 12, icon: '🐙', color: '#10b981' },
                { label: 'Resume Score', count: '72%', icon: '📄', color: '#f59e0b' },
                { label: 'Courses Completed', count: 2, icon: '📚', color: '#8b5cf6' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{item.icon}</span>
                    <span className="text-xs text-[#9898b0]">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: item.color }}>{item.count}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* ── AI Summary ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-indigo-500/8 border border-indigo-500/20 rounded-2xl p-5 flex items-start gap-4"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">
              AI Career Analysis
              {dnaData && <span className="ml-2 text-emerald-400 normal-case">· Live</span>}
            </p>
            {isLoading
              ? <div className="space-y-2"><SkeletonBlock h="h-4" /><SkeletonBlock h="h-4" w="w-4/5" /></div>
              : <p className="text-sm text-white leading-relaxed">
                  {aiSummary || 'Your strongest career identity is a Backend Developer with deep Python and SQL expertise. Focus on Docker and System Design to unlock 3 more career paths.'}
                </p>
            }
          </div>
        </motion.div>

      </div>
      <AIAssistant />
    </AppLayout>
  );
};

export default CareerDNA;
