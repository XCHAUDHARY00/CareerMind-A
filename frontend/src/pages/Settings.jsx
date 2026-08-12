import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, GitBranch, Palette, Trash2, ChevronRight, Link2, Check, Loader2, Sun, Moon } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import AIAssistant from '../components/ai/AIAssistant';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api';

const SettingRow = ({ label, description, children }) => (
  <div className="flex items-center justify-between py-4 border-b last:border-0" style={{ borderColor: 'var(--bg-card-border)' }}>
    <div>
      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {description && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</p>}
    </div>
    <div className="ml-4 flex-shrink-0">{children}</div>
  </div>
);

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)}
    className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${value ? 'bg-indigo-500' : 'bg-[#2a2a38]'}`}
  >
    <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const tabs = [
  { id: 'account', icon: User, label: 'Account' },
  { id: 'notifications', icon: Bell, label: 'Notifications' },
  { id: 'appearance', icon: Palette, label: 'Appearance' },
  { id: 'connected', icon: GitBranch, label: 'Connected' },
  { id: 'security', icon: Shield, label: 'Security' },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Account state
  const [profileData, setProfileData] = useState(null);
  const [accountForm, setAccountForm] = useState({ username: '', bio: '', experience: '' });
  const [accountSaving, setAccountSaving] = useState(false);
  const [accountMsg, setAccountMsg] = useState('');

  // Connected state
  const [githubInput, setGithubInput] = useState('');
  const [linkedinInput, setLinkedinInput] = useState('');
  const [connSaving, setConnSaving] = useState('');
  const [connMsg, setConnMsg] = useState('');

  // Notification toggles
  const [notifToggles, setNotifToggles] = useState({
    daily: true, insights: true, jobAlerts: false, streak: true,
  });

  // Appearance toggles
  const [reduceAnim, setReduceAnim] = useState(false);
  const [compactSidebar, setCompactSidebar] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get('/myprofile/');
      const p = res.data?.data;
      if (p) {
        setProfileData(p);
        setAccountForm({
          username: p.user?.username || '',
          bio: p.bio || '',
          experience: p.experience || '',
        });
        setGithubInput(p.github_username || '');
        setLinkedinInput(p.linkedin_url || '');
      }
    } catch (e) { /* ignore */ }
  };

  const handleAccountSave = async () => {
    setAccountSaving(true);
    setAccountMsg('');
    try {
      await api.patch('/profile/update/', accountForm);
      setAccountMsg('Saved successfully!');
      await loadProfile();
    } catch (e) {
      setAccountMsg('Failed to save. Please try again.');
    } finally {
      setAccountSaving(false);
      setTimeout(() => setAccountMsg(''), 3000);
    }
  };

  const handleGitHubSave = async () => {
    setConnSaving('github');
    setConnMsg('');
    try {
      if (githubInput.trim()) {
        await api.post('/github/link/', { username: githubInput.trim().replace('@', '') });
        setConnMsg('GitHub linked! Head to GitHub page to analyze.');
      } else {
        await api.delete('/github/unlink/');
        setConnMsg('GitHub disconnected.');
      }
      await loadProfile();
    } catch (e) {
      setConnMsg(e.response?.data?.message || 'Failed to save GitHub');
    } finally {
      setConnSaving('');
      setTimeout(() => setConnMsg(''), 4000);
    }
  };

  const handleLinkedInSave = async () => {
    setConnSaving('linkedin');
    setConnMsg('');
    try {
      await api.post('/linkedin/link/', { url: linkedinInput.trim() });
      setConnMsg(linkedinInput.trim() ? 'LinkedIn linked!' : 'LinkedIn disconnected.');
      await loadProfile();
    } catch (e) {
      setConnMsg(e.response?.data?.message || 'Failed to save LinkedIn');
    } finally {
      setConnSaving('');
      setTimeout(() => setConnMsg(''), 4000);
    }
  };

  const cardStyle = { background: 'var(--bg-card)', borderColor: 'var(--bg-card-border)', boxShadow: 'var(--shadow-card)' };
  const inputStyle = { background: 'var(--bg-input)', borderColor: 'var(--bg-card-border)', color: 'var(--text-primary)' };

  return (
    <AppLayout title="Settings" subtitle="Manage your account preferences">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar tabs */}
          <div className="md:col-span-1">
            <div className="rounded-2xl p-2 space-y-1 border" style={cardStyle}>
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                      activeTab === tab.id ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300' : ''
                    }`}
                    style={activeTab !== tab.id ? { color: 'var(--text-muted)' } : {}}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
              <div className="h-px my-2" style={{ background: 'var(--bg-card-border)' }} />
              <button onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all text-left">
                <Trash2 size={14} />
                Danger Zone
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl p-5 border" style={cardStyle}>

              {/* ACCOUNT */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Account Settings</h2>
                  <div className="space-y-4 mb-5">
                    {[
                      { key: 'username', label: 'Username', placeholder: 'your_username' },
                      { key: 'bio', label: 'Bio', placeholder: 'Tell us about yourself...' },
                      { key: 'experience', label: 'Experience', placeholder: 'e.g. 2 years in backend development' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                          style={{ color: 'var(--text-secondary)' }}>{f.label}</label>
                        <input type="text" value={accountForm[f.key]} placeholder={f.placeholder}
                          onChange={e => setAccountForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                          id={`settings-${f.key}-input`}
                          className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
                          style={inputStyle} />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                        style={{ color: 'var(--text-secondary)' }}>Email</label>
                      <input type="email" value={user?.user?.email || user?.email || ''}
                        readOnly className="w-full border rounded-xl px-3 py-2.5 text-sm opacity-60 cursor-not-allowed"
                        style={inputStyle} />
                      <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>Email cannot be changed here.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button id="settings-save-btn" onClick={handleAccountSave} disabled={accountSaving}
                      className="flex items-center gap-2 px-5 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-60">
                      {accountSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                      {accountSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {accountMsg && (
                      <span className={`text-xs ${accountMsg.includes('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>
                        {accountMsg}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Notification Preferences</h2>
                  <div className="divide-y" style={{ borderColor: 'var(--bg-card-border)' }}>
                    <SettingRow label="Daily Learning Reminder" description="Get reminded to complete your daily tasks">
                      <Toggle value={notifToggles.daily} onChange={v => setNotifToggles(p => ({ ...p, daily: v }))} />
                    </SettingRow>
                    <SettingRow label="AI Career Insights" description="Weekly AI analysis of your progress">
                      <Toggle value={notifToggles.insights} onChange={v => setNotifToggles(p => ({ ...p, insights: v }))} />
                    </SettingRow>
                    <SettingRow label="Job Match Alerts" description="Notify when new jobs match your profile">
                      <Toggle value={notifToggles.jobAlerts} onChange={v => setNotifToggles(p => ({ ...p, jobAlerts: v }))} />
                    </SettingRow>
                    <SettingRow label="Streak Reminders" description="Don't break your learning streak">
                      <Toggle value={notifToggles.streak} onChange={v => setNotifToggles(p => ({ ...p, streak: v }))} />
                    </SettingRow>
                  </div>
                </div>
              )}

              {/* APPEARANCE */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Appearance</h2>
                  <div className="divide-y" style={{ borderColor: 'var(--bg-card-border)' }}>
                    <SettingRow label="Theme" description={`Currently: ${theme === 'dark' ? 'Dark Mode' : 'Light Mode'}`}>
                      <button onClick={toggleTheme} id="settings-theme-toggle"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:border-indigo-500/40"
                        style={{ borderColor: 'var(--bg-card-border)', color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}>
                        {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                      </button>
                    </SettingRow>
                    <SettingRow label="Reduce Animations" description="Turn off entrance animations">
                      <Toggle value={reduceAnim} onChange={setReduceAnim} />
                    </SettingRow>
                    <SettingRow label="Compact Sidebar" description="Start with collapsed sidebar">
                      <Toggle value={compactSidebar} onChange={setCompactSidebar} />
                    </SettingRow>
                  </div>
                </div>
              )}

              {/* CONNECTED ACCOUNTS */}
              {activeTab === 'connected' && (
                <div>
                  <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Connected Accounts</h2>
                  <div className="space-y-5">
                    {/* GitHub */}
                    <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--bg-card-border)', background: 'var(--bg-secondary)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <GitBranch size={16} className="text-indigo-400" />
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>GitHub</span>
                        {profileData?.github_username && (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1"><Check size={10} /> Connected</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={githubInput} onChange={e => setGithubInput(e.target.value)}
                          placeholder="GitHub username (without @)"
                          id="settings-github-input"
                          className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
                          style={inputStyle} />
                        <button onClick={handleGitHubSave} disabled={connSaving === 'github'}
                          id="settings-github-save-btn"
                          className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-1.5 disabled:opacity-60">
                          {connSaving === 'github' ? <Loader2 size={13} className="animate-spin" /> : null}
                          {githubInput.trim() ? 'Save' : 'Disconnect'}
                        </button>
                      </div>
                      <p className="text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                        Leave empty and click Disconnect to unlink. After linking, go to the GitHub page to run analysis.
                      </p>
                    </div>

                    {/* LinkedIn */}
                    <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--bg-card-border)', background: 'var(--bg-secondary)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Link2 size={16} className="text-blue-400" />
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>LinkedIn</span>
                        {profileData?.linkedin_url && (
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1"><Check size={10} /> Connected</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input type="url" value={linkedinInput} onChange={e => setLinkedinInput(e.target.value)}
                          placeholder="https://linkedin.com/in/your-profile"
                          id="settings-linkedin-input"
                          className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500/60 transition-all"
                          style={inputStyle} />
                        <button onClick={handleLinkedInSave} disabled={connSaving === 'linkedin'}
                          id="settings-linkedin-save-btn"
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-xs font-semibold text-white transition-all flex items-center gap-1.5 disabled:opacity-60">
                          {connSaving === 'linkedin' ? <Loader2 size={13} className="animate-spin" /> : null}
                          {linkedinInput.trim() ? 'Save' : 'Disconnect'}
                        </button>
                      </div>
                      {profileData?.linkedin_url && (
                        <a href={profileData.linkedin_url} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-blue-400 hover:text-blue-300 mt-1.5 flex items-center gap-1">
                          View profile ↗
                        </a>
                      )}
                    </div>

                    {connMsg && (
                      <p className={`text-xs ${connMsg.includes('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>{connMsg}</p>
                    )}
                  </div>
                </div>
              )}

              {/* SECURITY */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--text-primary)' }}>Security</h2>
                  <div className="divide-y" style={{ borderColor: 'var(--bg-card-border)' }}>
                    <SettingRow label="Change Password" description="Update your account password">
                      <button className="flex items-center gap-1 px-3 py-1.5 border rounded-xl text-xs transition-all"
                        style={{ borderColor: 'var(--bg-card-border)', color: 'var(--text-secondary)' }}>
                        Change <ChevronRight size={12} />
                      </button>
                    </SettingRow>
                    <SettingRow label="Two-Factor Authentication" description="Add an extra layer of security">
                      <Toggle value={false} onChange={() => {}} />
                    </SettingRow>
                    <SettingRow label="Active Sessions" description="1 active session">
                      <button className="text-xs text-amber-400 hover:text-amber-300 transition-colors">View</button>
                    </SettingRow>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Danger zone */}
            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-red-500/8 border border-red-500/20 rounded-2xl p-5 mt-5">
                <h3 className="text-sm font-semibold text-red-400 mb-3">Danger Zone</h3>
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                  Once you delete your account, all your data will be permanently removed. This action cannot be undone.
                </p>
                <button className="px-4 py-2 border border-red-500/40 text-red-400 hover:bg-red-500/15 rounded-xl text-xs font-semibold transition-all">
                  Delete Account
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <AIAssistant />
    </AppLayout>
  );
};

export default Settings;
