import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, ChevronRight, Zap, Clock, TrendingUp, X } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import { mockProjects } from '../data/mockData';

const ImpactBadge = ({ impact }) => {
  const config = {
    High: { color: '#10b981', bg: 'bg-emerald-500/15', border: 'border-emerald-500/25' },
    Medium: { color: '#f59e0b', bg: 'bg-amber-500/15', border: 'border-amber-500/25' },
  };
  const c = config[impact] || config.Medium;
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${c.bg} ${c.border}`} style={{ color: c.color }}>
      {impact} Impact
    </span>
  );
};

const Projects = () => {
  const [selected, setSelected] = useState(null);

  return (
    <AppLayout title="Projects" subtitle="Build projects that prove your skills">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-500/8 border border-indigo-500/20 rounded-2xl p-4 flex items-center gap-3 mb-6"
        >
          <FolderGit2 size={18} className="text-indigo-400 flex-shrink-0" />
          <p className="text-xs text-[#9898b0]">
            These projects are AI-selected to target your biggest skill gaps and make the most career impact.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0d0d12] border border-[#1a1a25] hover:border-[#2a2a38] rounded-2xl p-5 group cursor-pointer transition-all hover:-translate-y-0.5"
              onClick={() => setSelected(project)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                  <FolderGit2 size={18} className="text-indigo-400" />
                </div>
                <ImpactBadge impact={project.impact} />
              </div>

              <h3 className="text-sm font-semibold text-white mb-2">{project.title}</h3>
              <p className="text-xs text-[#55556a] leading-relaxed mb-4">{project.description}</p>

              <div className="flex items-center gap-3 text-[10px] text-[#55556a] mb-4">
                <span className="flex items-center gap-1"><Zap size={9} />{project.difficulty}</span>
                <span className="flex items-center gap-1"><Clock size={9} />{project.duration}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.skills.map(skill => (
                  <span key={skill} className="text-[10px] px-2 py-0.5 rounded-lg bg-[#1a1a2e] border border-[#2a2a38] text-[#9898b0]">
                    {skill}
                  </span>
                ))}
              </div>

              <button className="w-full py-2 border border-indigo-500/30 rounded-xl text-xs font-semibold text-indigo-400 hover:bg-indigo-500/10 transition-all flex items-center justify-center gap-1">
                View Project Plan <ChevronRight size={12} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Project detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-lg bg-[#0d0d12] border border-[#2a2a38] rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-[#55556a] hover:text-white transition-colors">
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center">
                <FolderGit2 size={18} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">{selected.title}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-[#55556a]">{selected.difficulty}</span>
                  <span className="text-[#2a2a38]">·</span>
                  <span className="text-[10px] text-[#55556a]">{selected.duration}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#9898b0] leading-relaxed mb-5">{selected.description}</p>

            <div className="mb-5">
              <p className="text-xs font-semibold text-[#9898b0] uppercase tracking-wider mb-3">Milestones</p>
              <div className="relative pl-5 space-y-3">
                <div className="absolute left-2 top-1 bottom-1 w-px bg-[#1a1a25]" />
                {selected.milestones.map((m, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-3 top-1.5 w-2 h-2 rounded-full border border-[#2a2a38] bg-[#0d0d12]" />
                    <p className="text-xs text-[#9898b0]">{m}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold text-[#9898b0] uppercase tracking-wider mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.skills.map(skill => (
                  <span key={skill} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/25 text-indigo-300">{skill}</span>
                ))}
              </div>
            </div>

            <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl text-sm font-semibold text-white transition-all hover:from-indigo-600 hover:to-violet-700">
              Start This Project
            </button>
          </motion.div>
        </div>
      )}

      <AIAssistant />
    </AppLayout>
  );
};

export default Projects;
