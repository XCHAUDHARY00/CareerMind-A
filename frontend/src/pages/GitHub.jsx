import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, ExternalLink, Star, TrendingUp, Check, AlertTriangle, RefreshCw, Loader2, X } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const MetricCard = ({ metric, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="rounded-2xl p-4 border"
    style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card-border)', boxShadow: 'var(--shadow-card)' }}
  >
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{metric.label}</p>
      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{metric.score}</span>
    </div>
    <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'var(--bg-primary)' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${metric.score}%` }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
        className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
      />
    </div>
    <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>{metric.description}</p>
  </motion.div>
);
const GitHubPage = () => {
  const { refreshUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [inputUsername, setInputUsername] = useState('');
  const [error, setError] = useState('');
  const [saveMsg, setSaveMsg] = useState('');


  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/myprofile/');
      const prof = res.data?.data;
      setProfile(prof);
      if (prof?.github_username) {
        setInputUsername(prof.github_username);
        // Load cached data first from profile
        if (prof.github_data) {
          setGithubData(prof.github_data);
        } else {
          // No cache — fetch fresh
          await fetchGitHubAnalysis(false);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchGitHubAnalysis = async (force = false) => {
    setAnalyzing(true);
    setLoadingStep('Fetching GitHub profile data...');
    setError('');
    try {
      const res = await api.get(`/github/analyze/${force ? '?force=true' : ''}`);
      if (res.data?.data) {
        setGithubData(res.data.data);
        setLoadingStep('');
      }
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to fetch GitHub data';
      setError(msg);
      setLoadingStep('');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    const username = inputUsername.trim().replace('@', '').replace('https://github.com/', '');
    if (!username) return;
    setError('');
    setAnalyzing(true);
    try {
      setLoadingStep('Saving GitHub username...');
      await api.post('/github/link/', { username });

      setLoadingStep('Analyzing your GitHub profile with AI...');
      const res = await api.get('/github/analyze/');
      if (res.data?.data) {
        setGithubData(res.data.data);
        // Refresh profile state & global auth state
        const updatedProf = await refreshUserProfile();
        setProfile(updatedProf);
        setSaveMsg('GitHub connected successfully!');
        setTimeout(() => setSaveMsg(''), 4000);
      }
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to connect GitHub. Check the username and try again.';
      setError(msg);
    } finally {
      setAnalyzing(false);
      setLoadingStep('');
    }
  };

  const handleDisconnect = async () => {
    try {
      await api.delete('/github/unlink/');
      setGithubData(null);
      setProfile(prev => ({ ...prev, github_username: null, github_data: null }));
      setInputUsername('');
      await refreshUserProfile();
      setSaveMsg('GitHub disconnected.');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) {
      setError('Failed to disconnect');
    }
  };

  if (loading) {
    return (
      <AppLayout title="GitHub Intelligence" subtitle="Turn your code into career evidence">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 size={28} className="animate-spin text-indigo-400" />
        </div>
        <AIAssistant />
      </AppLayout>
    );
  }

  const isConnected = !!profile?.github_username;

  if (!isConnected || !githubData) {
    return (
      <AppLayout title="GitHub Intelligence" subtitle="Turn your code into career evidence">
        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 rounded-2xl border flex items-center justify-center mb-4"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card-border)' }}>
            <GitBranch size={28} style={{ color: 'var(--text-muted)' }} />
          </div>
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Connect Your GitHub</h2>
          <p className="text-sm text-center max-w-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            Connect GitHub to turn your coding activity into career evidence that employers can see.
          </p>
          {analyzing ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-3 px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <Loader2 size={16} className="animate-spin text-indigo-400" />
                <span className="text-sm text-indigo-400 font-medium">{loadingStep || 'Analyzing your GitHub profile...'}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConnect} className="flex gap-2 w-full max-w-sm">
              <input
                type="text"
                placeholder="Your GitHub username"
                value={inputUsername}
                onChange={e => setInputUsername(e.target.value)}
                id="github-username-input"
                className="flex-1 px-3 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-indigo-500/60 transition-all"
                style={{ background: 'var(--bg-input)', borderColor: 'var(--bg-card-border)', color: 'var(--text-primary)' }}
              />
              <button type="submit"
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-xl text-sm font-semibold text-white">
                <GitBranch size={15} /> Connect
              </button>
            </form>
          )}
          {error && <p className="text-xs text-red-400 mt-3">{error}</p>}
          {saveMsg && <p className="text-xs text-emerald-400 mt-3">{saveMsg}</p>}
        </div>
        <AIAssistant />
      </AppLayout>
    );
  }

  const g = githubData;

  return (
    <AppLayout title="GitHub Intelligence" subtitle="Your coding activity, analyzed by AI">
      <div className="p-6 max-w-7xl mx-auto space-y-5">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 relative overflow-hidden border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card-border)', boxShadow: 'var(--shadow-card)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
            {g.avatar_url ? (
              <img src={g.avatar_url} alt={g.username} className="w-14 h-14 rounded-2xl border-2 border-indigo-500/30" />
            ) : (
              <div className="w-14 h-14 rounded-2xl border flex items-center justify-center"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--bg-card-border)' }}>
                <GitBranch size={24} style={{ color: 'var(--text-primary)' }} />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>@{g.username}</p>
                {g.name && g.name !== g.username && (
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{g.name}</span>
                )}
                <Check size={14} className="text-emerald-400" />
                <a href={g.github_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors">
                  <ExternalLink size={11} /> View on GitHub
                </a>
              </div>
              {g.bio && <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{g.bio}</p>}
              <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1"><GitBranch size={11} />{g.repos} repos</span>
                <span className="flex items-center gap-1"><Star size={11} />{g.stars} stars</span>
                <span>{g.followers} followers</span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2">
              <div className="flex flex-col items-center">
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>GitHub Strength</p>
                <p className="text-3xl font-bold gradient-text">{g.strength}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>out of 100</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => fetchGitHubAnalysis(true)} disabled={analyzing}
                  className="flex items-center gap-1 text-[10px] px-2 py-1 border rounded-lg transition-all"
                  style={{ borderColor: 'var(--bg-card-border)', color: 'var(--text-muted)' }}>
                  <RefreshCw size={10} className={analyzing ? 'animate-spin' : ''} /> Refresh
                </button>
                <button onClick={handleDisconnect}
                  className="flex items-center gap-1 text-[10px] px-2 py-1 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-all">
                  <X size={10} /> Disconnect
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Summary */}
        {g.ai_summary && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-indigo-500/8 border border-indigo-500/20 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={14} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">AI Analysis</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{g.ai_summary}</p>
            </div>
          </motion.div>
        )}

        {/* Resume consistency */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-5 border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card-border)', boxShadow: 'var(--shadow-card)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Resume ↔ GitHub Evidence Consistency</h3>
          <div className="flex items-center gap-4 mb-5">
            <div className="text-3xl font-bold text-emerald-400">{g.resume_consistency}%</div>
            <div className="flex-1">
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${g.resume_consistency}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {(g.consistency_points || []).map((point, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check size={13} className="text-emerald-400 flex-shrink-0" />
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{point}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Languages */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl p-5 border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card-border)', boxShadow: 'var(--shadow-card)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Languages Used</h3>
            <div className="space-y-3">
              {(g.languages || []).map((lang, i) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                    <span>{lang.name}</span>
                    <span className="font-semibold">{lang.percentage}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${lang.percentage}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
                      className="h-full rounded-full" style={{ backgroundColor: lang.color }} />
                  </div>
                </div>
              ))}
              {(!g.languages || g.languages.length === 0) && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No language data found in repositories.</p>
              )}
            </div>
          </motion.div>

          {/* Top repos */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-2xl p-5 border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card-border)', boxShadow: 'var(--shadow-card)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Top Repositories</h3>
            <div className="space-y-3">
              {(g.repos_list || []).map((repo) => (
                <a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-xl border transition-all block hover:-translate-y-0.5"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--bg-card-border)' }}>
                  <GitBranch size={14} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{repo.name}</p>
                    <p className="text-[10px] leading-relaxed mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{repo.description}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      <span className="flex items-center gap-1"><Star size={9} />{repo.stars}</span>
                      {repo.language && <span>{repo.language}</span>}
                      <span>{repo.updated}</span>
                    </div>
                  </div>
                </a>
              ))}
              {(!g.repos_list || g.repos_list.length === 0) && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>No public repositories found.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Metrics grid */}
        <div>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Code Quality Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(g.metrics || []).map((m, i) => (
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
