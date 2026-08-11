import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Check, AlertTriangle, TrendingUp, Star } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import { mockResume } from '../data/mockData';

const ScoreBar = ({ label, score, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -15 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
  >
    <div className="flex justify-between text-xs text-[#9898b0] mb-1.5">
      <span>{label}</span>
      <span className="font-semibold text-white">{score}%</span>
    </div>
    <div className="h-1.5 bg-[#1a1a2e] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </motion.div>
);

const Resume = () => {
  const [uploaded, setUploaded] = useState(true); // mock as uploaded
  const [dragging, setDragging] = useState(false);

  return (
    <AppLayout title="Resume Intelligence" subtitle="AI-powered resume analysis">
      <div className="p-6 max-w-5xl mx-auto space-y-5">
        {/* Upload zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragging ? 'border-indigo-500/60 bg-indigo-500/8' : 'border-[#1a1a25] hover:border-[#2a2a38]'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); setUploaded(true); }}
        >
          {uploaded ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Check size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">resume_raj_chaudhary.pdf</p>
                <p className="text-xs text-[#55556a] mt-0.5">Uploaded · Analyzed · Up to date</p>
              </div>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition-colors">
                Upload New Version
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#111118] border border-[#2a2a38] flex items-center justify-center">
                <Upload size={22} className="text-[#55556a]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Drop your resume here</p>
                <p className="text-xs text-[#55556a] mt-1">PDF or DOCX, max 10MB</p>
              </div>
              <button
                onClick={() => setUploaded(true)}
                className="px-5 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-xs font-semibold text-indigo-300 hover:bg-indigo-500/30 transition-all"
              >
                Browse Files
              </button>
            </div>
          )}
        </motion.div>

        {uploaded && (
          <>
            {/* Overall score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="md:col-span-1 bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5 flex flex-col items-center justify-center text-center"
              >
                <div className="relative w-24 h-24 mb-3">
                  <svg viewBox="0 0 36 36" className="-rotate-90 w-full h-full">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1a1a2e" strokeWidth="3" />
                    <motion.circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke="#6366f1" strokeWidth="3"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 0 }}
                      strokeDasharray={`${mockResume.score}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{mockResume.score}</span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-white">Resume Score</p>
                <p className="text-xs text-[#55556a] mt-1">Room for improvement</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="md:col-span-2 bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5 space-y-4"
              >
                <h3 className="text-sm font-semibold text-white">Section Breakdown</h3>
                <ScoreBar label="ATS Readiness" score={mockResume.ats} color="#6366f1" delay={0.2} />
                <ScoreBar label="Skill Relevance" score={mockResume.skillRelevance} color="#8b5cf6" delay={0.25} />
                <ScoreBar label="Project Strength" score={mockResume.projectStrength} color="#3b82f6" delay={0.3} />
                <ScoreBar label="Impact Statements" score={mockResume.impactStatements} color="#f59e0b" delay={0.35} />
                <ScoreBar label="Role Alignment" score={mockResume.roleAlignment} color="#14b8a6" delay={0.4} />
              </motion.div>
            </div>

            {/* Evidence consistency */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0d0d12] border border-[#1a1a25] rounded-2xl p-5"
            >
              <h3 className="text-sm font-semibold text-white mb-4">Evidence Consistency</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-400">{mockResume.evidenceConsistency}%</p>
                  <p className="text-[10px] text-[#55556a]">Resume ↔ GitHub</p>
                </div>
                <div className="flex-1 h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mockResume.evidenceConsistency}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                  />
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { text: 'Python claim supported by GitHub activity', ok: true },
                  { text: 'Django projects visible in your portfolio', ok: true },
                  { text: 'React expertise claim lacks sufficient evidence', ok: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {item.ok ? <Check size={13} className="text-emerald-400" /> : <AlertTriangle size={13} className="text-amber-400" />}
                    <span className={`text-xs ${item.ok ? 'text-[#9898b0]' : 'text-amber-300'}`}>{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-indigo-500/8 border border-indigo-500/20 rounded-2xl p-5"
            >
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">AI Improvement Tips</p>
              <ul className="space-y-2">
                {[
                  'Add quantified impact statements — e.g. "Reduced API response time by 40%"',
                  'Include Docker and Redis in skills section to match current job requirements',
                  'Add a link to your GitHub profile for direct evidence of coding activity',
                  'Expand the Projects section with metrics and technologies used',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#9898b0]">
                    <Star size={11} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </div>
      <AIAssistant />
    </AppLayout>
  );
};

export default Resume;
