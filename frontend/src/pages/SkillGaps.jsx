import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { X, ArrowRight, BookOpen, FolderGit2, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import api from '../api';
import { mockSkillGaps } from '../data/mockData';

// ─── API fetch function ───────────────────────────────────────────────────────
const fetchSkillGaps = async (role) => {
  try {
    const url = role
      ? `/skills_gap/?role=${encodeURIComponent(role)}`
      : `/skills_gap/`;
    const res = await api.get(url);
    if (res.data?.status !== 'success') {
      throw new Error(res.data?.message || 'Failed to load skill gaps');
    }
    return res.data.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Server error occurred');
  }
};

// ─── Priority Badge ───────────────────────────────────────────────────────────
const PriorityBadge = ({ priority }) => {
  const config = {
    high:   { label: 'High Priority', bg: 'bg-red-500/15',    text: 'text-red-400',    border: 'border-red-500/25' },
    medium: { label: 'Medium',        bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/25' },
    low:    { label: 'Low',           bg: 'bg-blue-500/15',   text: 'text-blue-400',   border: 'border-blue-500/25' },
  };
  const c = config[priority] || config.low;
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
      {c.label}
    </span>
  );
};

// ─── Skill Detail Drawer ──────────────────────────────────────────────────────
const SkillDrawer = ({ skill, onClose }) => {
  if (!skill) return null;
  const progress = (skill.current / skill.required) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex justify-end"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-[#0d0d12] border-l border-[#1a1a25] h-full overflow-y-auto p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-[#55556a] hover:text-white transition-colors">
          <X size={18} />
        </button>
        <div className="mt-8">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl font-bold text-indigo-300">
              {skill.name[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{skill.name}</h2>
              <p className="text-xs text-[#55556a] mt-0.5">{skill.category}</p>
              <div className="mt-1"><PriorityBadge priority={skill.priority} /></div>
            </div>
          </div>

          <div className="bg-[#111118] border border-[#1a1a25] rounded-xl p-4 mb-5">
            <div className="flex justify-between text-xs text-[#55556a] mb-2">
              <span>Current Level</span><span>Target Level</span>
            </div>
            <div className="h-2 bg-[#1a1a2e] rounded-full mb-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              />
            </div>
            <div className="flex justify-between">
              <span className="text-lg font-bold text-white">{skill.current}<span className="text-xs text-[#55556a]">/10</span></span>
              <span className="text-lg font-bold text-indigo-400">{skill.required}<span className="text-xs text-[#55556a]">/10</span></span>
            </div>
            <p className="text-xs text-red-400 mt-2">Gap: {skill.gap} levels to close</p>
          </div>

          <div className="mb-5">
            <p className="text-xs font-semibold text-[#9898b0] uppercase tracking-wider mb-2">Why It Matters</p>
            <p className="text-sm text-[#9898b0] leading-relaxed bg-[#111118] border border-[#1a1a25] rounded-xl p-3">
              {skill.reason}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <p className="text-xs font-semibold text-[#9898b0] uppercase tracking-wider">Recommendations</p>
            {[
              { icon: <BookOpen size={14} />, label: 'Recommended Course', value: `${skill.name} for Developers`, color: '#6366f1' },
              { icon: <FolderGit2 size={14} />, label: 'Practice Project', value: `Build something using ${skill.name}`, color: '#14b8a6' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-[#111118] border border-[#1a1a25] rounded-xl hover:border-[#2a2a38] transition-all">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${item.color}20`, color: item.color }}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] text-[#55556a] font-medium">{item.label}</p>
                  <p className="text-xs text-white">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4 mb-6">
            <p className="text-xs font-semibold text-emerald-400 mb-1">Expected Career Impact</p>
            <p className="text-sm text-[#9898b0]">
              Closing this gap will improve your readiness by <strong className="text-white">+{skill.gap * 2} points</strong>.
            </p>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-sm font-semibold text-white transition-all">
            Start Building This Skill <ArrowRight size={15} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-[#1a1a25]" />
      <div className="space-y-1.5 flex-1">
        <div className="h-3 bg-[#1a1a25] rounded w-1/3" />
        <div className="h-2.5 bg-[#1a1a25] rounded w-1/5" />
      </div>
      <div className="h-5 w-20 bg-[#1a1a25] rounded-full" />
    </div>
    <div className="h-2 bg-[#1a1a25] rounded-full" />
  </div>
);

// ─── Constants ────────────────────────────────────────────────────────────────
const ROLES = ['Backend Developer', 'Full Stack Developer', 'AI Engineer', 'Data Scientist'];
const FILTERS = [
  { id: 'all',    label: 'All' },
  { id: 'high',   label: 'High Priority' },
  { id: 'medium', label: 'Medium' },
  { id: 'low',    label: 'Low' },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const SkillGaps = () => {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState(null);  // null = profile default
  const [filter, setFilter]             = useState('all');
  const [selectedSkill, setSelectedSkill] = useState(null);

  // useQuery — React Query handles all caching automatically!
  // queryKey: ['skill-gaps', selectedRole] → role change hone par auto-refetch
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,   // true jab background refresh ho raha ho
  } = useQuery({
    queryKey: ['skill-gaps', selectedRole],   // selectedRole change → new query
    queryFn: () => fetchSkillGaps(selectedRole),
    placeholderData: (previousData) => previousData,  // role switch par purana data dikhao
  });

  const gaps        = data?.skill_gaps      || [];
  const usedRole    = data?.target_role     || selectedRole || '';
  const overallScore = data?.overall_gap_score ?? null;

  // Force invalidate — cache hatao, fresh fetch karo
  const [isForceRefreshing, setIsForceRefreshing] = useState(false);

  const handleForceRefresh = async () => {
    try {
      setIsForceRefreshing(true);
      const url = selectedRole ? `/skills_gap/?role=${encodeURIComponent(selectedRole)}&force=true` : `/skills_gap/?force=true`;
      await api.get(url); // Force new AI generation in DB
      await queryClient.invalidateQueries({ queryKey: ['skill-gaps', selectedRole] }); // Reload into UI
    } catch (err) {
      console.error("Failed to force refresh", err);
    } finally {
      setIsForceRefreshing(false);
    }
  };

  // Skill update pe cache clear karo (yahan se call kar sakte ho jab bhi skills change hon)
  // queryClient.invalidateQueries({ queryKey: ['skill-gaps'] });

  const displayGaps = gaps.length > 0 ? gaps : (isError ? mockSkillGaps : []);
  const filtered = filter === 'all' ? displayGaps : displayGaps.filter(s => s.priority === filter);

  return (
    <AppLayout title="Skill Gaps" subtitle="Know exactly what separates you from your target role">
      <div className="p-6 max-w-7xl mx-auto">

        {/* Error banner */}
        {isError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3 mb-5 bg-amber-500/10 border border-amber-500/25 rounded-xl"
          >
            <AlertCircle size={15} className="text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-300">{error?.message || 'Server unreachable. Showing demo data.'}</p>
            <button onClick={() => refetch()} className="ml-auto flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-medium">
              <RefreshCw size={11} /> Retry
            </button>
          </motion.div>
        )}

        {/* Role switcher + status bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
          <div className="flex gap-2 flex-wrap">
            {ROLES.map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(prev => prev === role ? null : role)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedRole === role
                    ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                    : 'border border-[#1a1a25] text-[#55556a] hover:text-white hover:border-[#2a2a38]'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Background fetch spinner */}
            {isFetching && !isLoading && (
              <span className="flex items-center gap-1.5 text-[10px] text-indigo-400">
                <RefreshCw size={10} className="animate-spin" /> updating...
              </span>
            )}
            {/* Role badge */}
            {usedRole && !isLoading && (
              <span className="text-[11px] text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                {usedRole}
              </span>
            )}
            {/* Force refresh */}
            {!isLoading && !isFetching && (
              <button
                onClick={handleForceRefresh}
                disabled={isForceRefreshing}
                title="Force refresh"
                className="p-1.5 rounded-lg border border-[#1a1a25] text-[#55556a] hover:text-white hover:border-[#2a2a38] transition-all disabled:opacity-50"
              >
                <RefreshCw size={14} className={isForceRefreshing ? "animate-spin text-indigo-400" : ""} />
              </button>
            )}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'High Priority', color: '#ef4444', priority: 'high' },
            { label: 'Medium Priority', color: '#f59e0b', priority: 'medium' },
            { label: 'Low Priority', color: '#3b82f6', priority: 'low' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-4 text-center"
            >
              {isLoading
                ? <div className="h-7 w-10 bg-[#1a1a25] rounded-lg animate-pulse mx-auto mb-1" />
                : <p className="text-2xl font-bold" style={{ color: item.color }}>
                    {displayGaps.filter(s => s.priority === item.priority).length}
                  </p>
              }
              <p className="text-xs text-[#55556a] mt-1">{item.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Overall readiness score */}
        {overallScore !== null && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-4 mb-5 flex items-center gap-4"
          >
            <div className="flex-1">
              <p className="text-xs text-[#55556a] mb-1.5">Role Readiness — {usedRole}</p>
              <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${overallScore}%` }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                />
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold gradient-text">{overallScore}<span className="text-sm text-[#55556a]">%</span></p>
              <p className="text-[10px] text-[#55556a]">Ready</p>
            </div>
          </motion.div>
        )}

        {/* Priority filters */}
        <div className="flex gap-2 mb-5">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === f.id
                  ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                  : 'border border-[#1a1a25] text-[#55556a] hover:text-white hover:border-[#2a2a38]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Skill gap cards */}
        <div className="space-y-3">
          {isLoading
            ? [1, 2, 3, 4].map(i => <SkeletonCard key={i} />)
            : filtered.length === 0
              ? <div className="py-16 text-center"><p className="text-[#55556a] text-sm">No gaps found for this filter.</p></div>
              : filtered.map((skill, i) => {
                const currentPct  = (skill.current / 10) * 100;
                const requiredPct = (skill.required / 10) * 100;
                const gapColor = skill.priority === 'high' ? '#ef4444' : skill.priority === 'medium' ? '#f59e0b' : '#3b82f6';

                return (
                  <motion.div
                    key={skill.id || skill.name}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => setSelectedSkill(skill)}
                    className="bg-[#0d0d12] border border-[#1a1a25] hover:border-[#2a2a38] rounded-2xl p-5 cursor-pointer group transition-all hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                          style={{ background: `${gapColor}15`, color: gapColor, border: `1px solid ${gapColor}25` }}
                        >
                          {skill.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{skill.name}</p>
                          <p className="text-[10px] text-[#55556a]">{skill.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <PriorityBadge priority={skill.priority} />
                        <ChevronRight size={14} className="text-[#2a2a38] group-hover:text-[#55556a] transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-[#55556a]">
                        <span>Current ({skill.current}/10)</span>
                        <span>Required ({skill.required}/10)</span>
                      </div>
                      <div className="relative h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }} animate={{ width: `${currentPct}%` }}
                          transition={{ delay: 0.2 + i * 0.05, duration: 0.8, ease: 'easeOut' }}
                          className="absolute h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                        />
                        <div className="absolute top-0 bottom-0 w-0.5 bg-white/30" style={{ left: `${requiredPct}%` }} />
                      </div>
                      <p className="text-[10px]" style={{ color: gapColor }}>Gap: {skill.gap} levels to close</p>
                    </div>
                  </motion.div>
                );
              })
          }
        </div>
      </div>

      <AnimatePresence>
        {selectedSkill && <SkillDrawer skill={selectedSkill} onClose={() => setSelectedSkill(null)} />}
      </AnimatePresence>
      <AIAssistant />
    </AppLayout>
  );
};

export default SkillGaps;
