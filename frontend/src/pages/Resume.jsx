import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Check, AlertTriangle, TrendingUp, Star, Loader2, RefreshCw } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import api from '../api';

const ScoreBar = ({ label, score, color, delay }) => (
  <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}>
    <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
      <span>{label}</span>
      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{score}%</span>
    </div>
    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }}
        transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
        className="h-full rounded-full" style={{ backgroundColor: color }} />
    </div>
  </motion.div>
);

const Resume = () => {
  const [analysis, setAnalysis] = useState(null);
  const [filename, setFilename] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      const res = await api.get('/resume/analysis/');
      if (res.data?.status === 'success') {
        setAnalysis(res.data.data);
        setFilename(res.data.filename);
      }
    } catch (e) {
      // 404 means no resume yet — that's fine
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files are supported.');
      return;
    }
    setError('');
    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await api.post('/resume/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.status === 'success') {
        setAnalysis(res.data.data);
        setFilename(res.data.filename);
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout title="Resume Intelligence" subtitle="AI-powered resume analysis">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={28} className="animate-spin text-indigo-400" />
        </div>
        <AIAssistant />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Resume Intelligence" subtitle="AI-powered resume analysis">
      <div className="p-6 max-w-5xl mx-auto space-y-5">
        {/* Upload zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer`}
          style={{
            borderColor: dragging ? 'var(--accent-indigo)' : 'var(--bg-card-border)',
            background: dragging ? 'rgba(99,102,241,0.05)' : 'transparent',
          }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => !uploading && fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept=".pdf" className="hidden" id="resume-file-input"
            onChange={e => handleFile(e.target.files[0])} />
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="animate-spin text-indigo-400" />
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Uploading & analyzing with AI…</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>This may take 10–20 seconds</p>
            </div>
          ) : analysis && filename ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Check size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{filename}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Uploaded · Analyzed · AI scored</p>
              </div>
              <button
                id="resume-reupload-btn"
                className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>
                <RefreshCw size={11} /> Upload New Version
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-2xl border flex items-center justify-center"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card-border)' }}>
                <Upload size={22} style={{ color: 'var(--text-muted)' }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Drop your resume here</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>PDF only, max 10MB</p>
              </div>
              <button id="resume-browse-btn"
                className="px-5 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-xs font-semibold text-indigo-300 hover:bg-indigo-500/30 transition-all"
                onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>
                Browse Files
              </button>
            </div>
          )}
          {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
        </motion.div>

        {analysis && (
          <>
            {/* Score + breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="md:col-span-1 rounded-2xl p-5 flex flex-col items-center justify-center text-center border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card-border)', boxShadow: 'var(--shadow-card)' }}>
                <div className="relative w-24 h-24 mb-3">
                  <svg viewBox="0 0 36 36" className="-rotate-90 w-full h-full">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--bg-primary)" strokeWidth="3" />
                    <motion.circle cx="18" cy="18" r="15.9" fill="none"
                      stroke="#6366f1" strokeWidth="3"
                      initial={{ strokeDashoffset: 100 }}
                      animate={{ strokeDashoffset: 100 - analysis.score }}
                      strokeDasharray={`${analysis.score}, 100`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{analysis.score}</span>
                  </div>
                </div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Resume Score</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {analysis.score >= 80 ? 'Strong Resume' : analysis.score >= 60 ? 'Room for improvement' : 'Needs work'}
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="md:col-span-2 rounded-2xl p-5 space-y-4 border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card-border)', boxShadow: 'var(--shadow-card)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Section Breakdown</h3>
                <ScoreBar label="ATS Readiness" score={analysis.ats} color="#6366f1" delay={0.2} />
                <ScoreBar label="Skill Relevance" score={analysis.skill_relevance} color="#8b5cf6" delay={0.25} />
                <ScoreBar label="Project Strength" score={analysis.project_strength} color="#3b82f6" delay={0.3} />
                <ScoreBar label="Impact Statements" score={analysis.impact_statements} color="#f59e0b" delay={0.35} />
                <ScoreBar label="Role Alignment" score={analysis.role_alignment} color="#14b8a6" delay={0.4} />
              </motion.div>
            </div>

            {/* Evidence consistency */}
            {analysis.consistency_points?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="rounded-2xl p-5 border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card-border)', boxShadow: 'var(--shadow-card)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Evidence Consistency</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-emerald-400">{analysis.evidence_consistency}%</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Resume ↔ GitHub</p>
                  </div>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${analysis.evidence_consistency}%` }}
                      transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  {analysis.consistency_points.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {item.ok ? <Check size={13} className="text-emerald-400" /> : <AlertTriangle size={13} className="text-amber-400" />}
                      <span className={`text-xs ${item.ok ? '' : 'text-amber-300'}`}
                        style={item.ok ? { color: 'var(--text-secondary)' } : {}}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AI Tips */}
            {analysis.ai_tips?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-indigo-500/8 border border-indigo-500/20 rounded-2xl p-5">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3">AI Improvement Tips</p>
                <ul className="space-y-2">
                  {analysis.ai_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <Star size={11} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* AI Summary */}
            {analysis.summary && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="rounded-2xl p-4 border"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card-border)' }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>AI Summary</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{analysis.summary}</p>
              </motion.div>
            )}
          </>
        )}
      </div>
      <AIAssistant />
    </AppLayout>
  );
};

export default Resume;
