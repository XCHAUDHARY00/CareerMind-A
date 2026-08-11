import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, Check, AlertTriangle, Search, ChevronRight } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import { mockJobs } from '../data/mockData';

const MatchBadge = ({ match }) => {
  const color = match >= 80 ? '#10b981' : match >= 65 ? '#f59e0b' : '#9898b0';
  return (
    <div className="flex flex-col items-center px-3 py-2 rounded-xl border" style={{ borderColor: `${color}30`, background: `${color}10` }}>
      <span className="text-lg font-bold" style={{ color }}>{match}%</span>
      <span className="text-[9px]" style={{ color }}>match</span>
    </div>
  );
};

const Jobs = () => {
  const [query, setQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  const filtered = mockJobs.filter(job =>
    !query || job.title.toLowerCase().includes(query.toLowerCase()) || job.company.toLowerCase().includes(query.toLowerCase())
  );

  if (selectedJob) {
    return (
      <AppLayout title="Job Analysis" subtitle={`${selectedJob.company} · ${selectedJob.title}`}>
        <div className="p-6 max-w-3xl mx-auto">
          <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 text-xs text-[#55556a] hover:text-white mb-6 transition-colors">
            ← Back to Jobs
          </button>

          {/* Match score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-6 mb-5"
          >
            <div className="flex items-center gap-5">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 36 36" className="-rotate-90 w-full h-full">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a1a2e" strokeWidth="3" />
                  <motion.circle
                    cx="18" cy="18" r="15.9" fill="none"
                    stroke={selectedJob.match >= 80 ? '#10b981' : '#f59e0b'} strokeWidth="3"
                    strokeDasharray={`${selectedJob.match} ${100 - selectedJob.match}`}
                    initial={{ strokeDashoffset: 100 }}
                    animate={{ strokeDashoffset: 0 }}
                    strokeLinecap="round"
                    style={{ strokeDasharray: `${selectedJob.match}, 100` }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{selectedJob.match}%</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{selectedJob.title}</h2>
                <p className="text-sm text-[#55556a]">{selectedJob.company} · {selectedJob.location}</p>
                <p className="text-sm font-semibold text-emerald-400 mt-1">{selectedJob.salary}</p>
                <p className="text-xs text-[#9898b0] mt-2">Job Match Score</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            {/* Skills matched */}
            <div className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5">
              <p className="text-xs font-semibold text-[#9898b0] uppercase tracking-wider mb-3">Skills You Have</p>
              <div className="space-y-2">
                {selectedJob.skillsMatch.map(skill => (
                  <div key={skill} className="flex items-center gap-2">
                    <Check size={13} className="text-emerald-400" />
                    <span className="text-sm text-white">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills gap */}
            <div className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5">
              <p className="text-xs font-semibold text-[#9898b0] uppercase tracking-wider mb-3">Missing Skills</p>
              <div className="space-y-2">
                {selectedJob.skillsGap.map(skill => (
                  <div key={skill} className="flex items-center gap-2">
                    <AlertTriangle size={13} className="text-amber-400" />
                    <span className="text-sm text-[#9898b0]">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendation */}
          <div className="bg-indigo-500/8 border border-indigo-500/20 rounded-2xl p-5 mb-5">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">AI Recommendation</p>
            <p className="text-sm text-[#9898b0] leading-relaxed">
              You're <span className="text-white font-medium">{selectedJob.match}%</span> ready for this role. To close the gap, focus on{' '}
              <span className="text-indigo-300 font-medium">{selectedJob.skillsGap.join(' and ')}</span>.
              These are achievable in 4–6 weeks with focused learning. You're very close — don't wait too long to apply!
            </p>
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-sm font-semibold text-white transition-all">
            Create Preparation Plan
          </button>
        </div>
        <AIAssistant />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Find Your Best-Match Roles" subtitle="AI matches you to jobs based on your actual skills">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Search */}
        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#55556a]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by role or company..."
            className="w-full bg-[#0d0d12] border border-[#1a1a25] rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-[#55556a] focus:outline-none focus:border-indigo-500/60 transition-all"
          />
        </div>

        {/* Job cards */}
        <div className="space-y-3">
          {filtered.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setSelectedJob(job)}
              className="bg-[#0d0d12] border border-[#1a1a25] hover:border-[#2a2a38] rounded-2xl p-5 cursor-pointer group transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{job.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#55556a]">
                        <span className="flex items-center gap-1"><Briefcase size={10} />{job.company}</span>
                        <span className="flex items-center gap-1"><MapPin size={10} />{job.location}</span>
                        <span className="flex items-center gap-1"><Clock size={10} />{job.posted}</span>
                      </div>
                    </div>
                    <MatchBadge match={job.match} />
                  </div>

                  <p className="text-xs font-semibold text-emerald-400 mb-2">{job.salary}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {job.skillsMatch.map(s => (
                      <span key={s} className="flex items-center gap-1 text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                        <Check size={8} />{s}
                      </span>
                    ))}
                    {job.skillsGap.map(s => (
                      <span key={s} className="flex items-center gap-1 text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                        <AlertTriangle size={8} />{s}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#2a2a38] group-hover:text-[#55556a] transition-colors flex-shrink-0 mt-2" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <AIAssistant />
    </AppLayout>
  );
};

export default Jobs;
