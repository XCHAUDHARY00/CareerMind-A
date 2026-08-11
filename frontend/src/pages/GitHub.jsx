import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, ExternalLink, Star, TrendingUp, Check, AlertTriangle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import { mockGitHub } from '../data/mockData';

const MetricCard = ({ metric, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-4"
  >
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs text-[#55556a] font-medium">{metric.label}</p>
      <span className="text-sm font-bold text-white">{metric.score}</span>
    </div>
    <div className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden mb-2">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${metric.score}%` }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
      />
    </div>
    <p className="text-[10px] text-[#55556a] leading-relaxed">{metric.description}</p>
  </motion.div>
);

const GitHubPage = () => {
  const [connected, setConnected] = useState(true);

  if (!connected) {
    return (
      <AppLayout title="GitHub Intelligence" subtitle="Turn your code into career evidence">
        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 rounded-2xl bg-[#0d0d12] border border-[#1a1a25] flex items-center justify-center mb-4">
            <GitBranch size={28} className="text-[#55556a]" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Connect Your GitHub</h2>
          <p className="text-sm text-[#55556a] text-center max-w-sm mb-6">
            Connect GitHub to turn your coding activity into career evidence that employers can see.
          </p>
          <button
            onClick={() => setConnected(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl text-sm font-semibold text-white"
          >
            <GitBranch size={16} /> Connect GitHub
          </button>
        </div>
        <AIAssistant />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="GitHub Intelligence" subtitle="Your coding activity, analyzed by AI">
      <div className="p-6 max-w-7xl mx-auto space-y-5">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#111118] border border-[#2a2a38] flex items-center justify-center">
              <GitBranch size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-base font-bold text-white">@{mockGitHub.username}</p>
                <Check size={14} className="text-emerald-400" />
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-[#55556a]">
                <span className="flex items-center gap-1"><GitBranch size={11} />{mockGitHub.repos} repositories</span>
                <span className="flex items-center gap-1">💻 {mockGitHub.commits} commits</span>
                <span className="flex items-center gap-1"><Star size={11} />{mockGitHub.stars} stars</span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-1">
              <p className="text-xs text-[#55556a]">GitHub Strength</p>
              <p className="text-3xl font-bold gradient-text">{mockGitHub.strength}</p>
              <p className="text-[10px] text-[#55556a]">out of 100</p>
            </div>
          </div>
        </motion.div>

        {/* Evidence consistency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Resume ↔ GitHub Evidence Consistency</h3>
          <div className="flex items-center gap-4 mb-5">
            <div className="text-3xl font-bold text-emerald-400">82%</div>
            <div className="flex-1">
              <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '82%' }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { text: 'Python experience supported by GitHub evidence', ok: true },
              { text: 'Django projects visible in repositories', ok: true },
              { text: 'SQL skills corroborated by database projects', ok: true },
              { text: 'Advanced React claim has limited GitHub evidence', ok: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                {item.ok ? <Check size={13} className="text-emerald-400 flex-shrink-0" /> : <AlertTriangle size={13} className="text-amber-400 flex-shrink-0" />}
                <span className={`text-xs ${item.ok ? 'text-[#9898b0]' : 'text-amber-400'}`}>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
          >
            <h3 className="text-sm font-semibold text-white mb-4">Languages Used</h3>
            <div className="space-y-3">
              {mockGitHub.languages.map((lang, i) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-xs text-[#9898b0] mb-1.5">
                    <span>{lang.name}</span>
                    <span className="font-semibold">{lang.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${lang.percentage}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top repos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
          >
            <h3 className="text-sm font-semibold text-white mb-4">Top Repositories</h3>
            <div className="space-y-3">
              {mockGitHub.repos_list.map((repo, i) => (
                <div key={repo.name} className="flex items-start gap-3 p-3 bg-[#111118] border border-[#1a1a25] rounded-xl hover:border-[#2a2a38] transition-all cursor-pointer">
                  <GitBranch size={14} className="text-[#55556a] flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{repo.name}</p>
                    <p className="text-[10px] text-[#55556a] leading-relaxed mt-0.5 line-clamp-2">{repo.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-[#55556a]">
                      <span className="flex items-center gap-1"><Star size={9} />{repo.stars}</span>
                      <span>{repo.language}</span>
                      <span>{repo.updated}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Metrics grid */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-4">Code Quality Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mockGitHub.metrics.map((m, i) => (
              <MetricCard key={m.label} metric={m} index={i} />
            ))}
          </div>
        </div>
      </div>
      <AIAssistant />
    </AppLayout>
  );
};

export default GitHubPage;
